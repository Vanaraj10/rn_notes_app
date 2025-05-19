import { View, Text, TouchableOpacity } from 'react-native'

export default function NoteCard({ note, onPress, index }) {
  const bgColors = ['#dD99ee', '#ee9d9d', '#91d48e', '#eee599', '#9Edddd', '#B69Cdd'];
  const bgColor = bgColors[index % bgColors.length]; // Use index for color

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ backgroundColor: bgColor, padding: 10, borderRadius: 8 }}
    >
      <Text style={{ fontSize: 35, marginLeft: 20, paddingBottom: 20,fontWeight:'500'}}>{note.title}</Text>
      <View style={{ right: 10, bottom: 2, flex: 1, position: 'absolute' }}>
        <Text style={{ fontSize: 20, marginLeft: 20 }}>
          {new Date(note.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}