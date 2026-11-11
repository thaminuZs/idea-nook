import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const students = [
  {id: 1, name: 'saman'},
  {id: 2, name: 'nayana'},
];

const Flat = () => {
  return (
    <FlatList style={styles.container}
      data={students} keyExtractor={(s) => s.id} renderItem={({item}) => (
        <View>
          <Text style={styles.item}>{item.name}</Text>
        </View>
      )}
    />
  )
}

export default Flat

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