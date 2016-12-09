module.exports = function (plugin, print) {
  const { fancy, colors } = print

  fancy('-----------------------------------------------')
  fancy(colors.red('  (                  )   (                   '))
  fancy(colors.red('  )\\ )   (        ( /(   )\\ )    *   )       '))
  fancy(colors.red(' (()/(   )\\ )     )\\()) (()/(  ` )  /(   (   '))
  fancy(colors.red('  /(_)) (()/(    ((_)\\   /(_))  ( )(_))  )\\  '))
  fancy(colors.red(' (_))    /(_))_   _((_) (_))   (_(_())  ((_) '))
  fancy(' |_ _|  ' + colors.red('(_))') + ' __| | \\| | |_ _|  |_   _|  | __|')
  fancy('  | |     | (_ | | .` |  | |     | |    | _| ')
  fancy(' |___|     \\___| |_|\\_| |___|    |_|    |___|')
  fancy('-----------------------------------------------')
  fancy('')
  fancy('An unfair headstart for your React Native apps.')
  fancy(colors.yellow('https://infinite.red/ignite'))
  fancy('')
  fancy('-----------------------------------------------')
}
