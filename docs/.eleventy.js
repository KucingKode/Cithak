module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy({
    'src/_includes/styles': 'styles',
  })
  eleventyConfig.addPassthroughCopy({
    'src/_includes/static': 'static',
  })

  return {
    passthroughFileCopy: true,
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src'
    },
  }
}
