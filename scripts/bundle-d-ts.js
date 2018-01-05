var dts = require('dts-bundle')

dts.bundle({
	name: 'gluegun',
  main: './build/types/index.d.ts',
  out: '../../dist/gluegun.d.ts' // weird path on purpose (??)
})
