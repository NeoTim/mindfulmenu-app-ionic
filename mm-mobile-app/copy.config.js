process.env.IONIC_FONTS_DIR = process.env.IONIC_WWW_DIR + '/asset/font';

module.exports = {
  copyAssets: {
    src: ['{{SRC}}/asset/**/*'],
    dest: '{{WWW}}/asset'
  },
  copyFonts: {
    src: ['{{ROOT}}/node_modules/ionicons/dist/fonts/**/*', '{{ROOT}}/node_modules/ionic-angular/fonts/**/*'],
    dest: '{{WWW}}/asset/font'
  }
}
