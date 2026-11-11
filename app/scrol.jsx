import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Scrol = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.item}>Amara</Text>
      <Text style={styles.item}>Nayana</Text>
      <Text style={styles.item}>Saman</Text>
    </ScrollView>
  )
}

export default Scrol

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 10,
    marginBottom: 1,
    fontSize: 20,
  }
})