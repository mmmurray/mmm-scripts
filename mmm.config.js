module.exports = {
  test: {
    coverageIgnores: ['src/**'],
  },
  components: [
    {
      type: 'ts-lib',
      name: 'lib',
      entryPath: 'src',
      outputPath: 'lib',
    },
  ],
}
