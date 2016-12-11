// @flow
import React from 'react'
import { View, Text } from 'react-native'
import styles from './Styles/SteveStyle'

export default class Steve extends React.Component {

  render () {
    return (
      <View style={styles.container}>
        <Text>Steve Component</Text>
      </View>
    )
  }
}

// // Prop type warnings
// Steve.propTypes = {
//   someProperty: React.PropTypes.object,
//   someSetting: React.PropTypes.bool.isRequired
// }
//
// // Defaults for props
// Steve.defaultProps = {
//   someSetting: false
// }
