const fs = require('fs');
const path = require('path');

const scssDir = path.join(__dirname, 'src/styles');
const outputFile = path.join(scssDir, 'mixins-map.scss');

function generateMixinContent(mixins) {
  const { simple, params, files } = mixins;

  return `
${files.map((file) => `@use '${file}' as *;`).join('\n')}

@use 'sass:string' as str;

@mixin apply($mixins...) {
  @each $mixin in $mixins {
    $mixin-str: #{$mixin};
     $breakpoint: null;
    
    // Extract breakpoint if exists
    @if str.index($mixin-str, '_') {
      $breakpoint: str.slice($mixin-str, str.index($mixin-str, '_') + 1);
      
      // Handle parameters with breakpoints
      @if str.index($mixin-str, '(') {
        $start: str.index($mixin-str, '(') + 1;
        $end: str.index($mixin-str, '_') - 2;
        $value: str.slice($mixin-str, $start, $end);
        $mixin-name: str.slice($mixin-str, 1, $start - 1);
        $mixin-str: $mixin-name + $value;
      } @else {
        $mixin-str: str.slice($mixin-str, 1, str.index($mixin-str, '_') - 1);
      }
    }
       
    // Wrap in media query if breakpoint exists
    @if $breakpoint {
      @include media-up($breakpoint) {
        ${simple.map((mixin, index) =>
          index === 0
            ? `@if $mixin-str == '${mixin}' {
          @include ${mixin};
        }`
            : ` @else if $mixin-str == '${mixin}' {
          @include ${mixin};
        }`).join('')}${params.map(name => 
           ` @else if str.index($mixin-str, '${name}(') == 1 {
          $start: str.index($mixin-str, '(') + 1;
          $end: str.length($mixin-str) - 1;
          $value: str.slice($mixin-str, $start, $end);
          @include ${name}(str.unquote($value));
        }`
        ).join('')}
      }
    } @else {
        ${simple
        .map((mixin, index) =>
            index === 0
            ? `@if $mixin-str == '${mixin}' {
          @include ${mixin};
        }`
            : ` @else if $mixin-str == '${mixin}' {
          @include ${mixin};
        }`
        )
        .join('')}${params
        .map(name => 
        ` @else if str.index($mixin-str, '${name}(') == 1 {
          $start: str.index($mixin-str, '(') + 1;
          $end: str.length($mixin-str) - 1;
          $value: str.slice($mixin-str, $start, $end);
          @include ${name}(str.unquote($value));
        }`
        )
        .join('')} @else {
            @warn "Mixin '#{$mixin}' is not defined.";
        }
    }
  }
}`;
}

function extractMixins(dir) {
  let simpleMixins = [];
  let paramMixins = [];
  let scannedFiles = new Set();

  // Scan all files in directory
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      const { simple, params, files } = extractMixins(filePath);
      simpleMixins.push(...simple);
      paramMixins.push(...params);
      files.forEach((f) => scannedFiles.add(f.replace('_', '')));
    } else if (file.endsWith('.scss') && file !== 'mixins-map.scss' && file !== 'index.scss') {
        const relativePath = path
        .relative(scssDir, filePath)
        .replace(/\\/g, '/')
        .replace(/\.scss$/, '');
      scannedFiles.add(relativePath);

      const content = fs.readFileSync(filePath, 'utf-8');
      const cleanContent = content
        .split('\n')
        .filter((line) => !line.trim().startsWith('//'))
        .join('\n');

      const mixinRegex = /@mixin\s+([\w-]+)(?:\s*\([^)]*\))?\s*{/g;
      const paramMixinRegex = /@mixin\s+([\w-]+)\s*\([^)]*\)\s*{/g;

      const paramMatches = [...cleanContent.matchAll(paramMixinRegex)]
        .map((m) => m[1])
        .filter((name) => name !== 'add-mixins');
      paramMixins.push(...paramMatches);

      const allMixins = [...cleanContent.matchAll(mixinRegex)]
        .map((m) => m[1])
        .filter((name) => name !== 'add-mixins');
      const simpleOnes = allMixins.filter((m) => !paramMatches.includes(m));
      simpleMixins.push(...simpleOnes);
    }
  });
  return {
    simple: [...new Set(simpleMixins)],
    params: [...new Set(paramMixins)],
    files: [...scannedFiles],
  };
}

const mixins = extractMixins(scssDir);
const content = generateMixinContent(mixins);
fs.writeFileSync(outputFile, content);
