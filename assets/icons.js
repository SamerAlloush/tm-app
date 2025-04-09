import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import messagerie from '../app/messagerie';
//import TabBarButtons from './TabBarButtons';
export const icons = {
    index: (color) => <FontAwesome name="dashboard" size={26} color={color} />,
    chantier: (color) => <MaterialIcons name="construction" size={26} color={color} />,
    profile: (color) => <AntDesign name="user" size={26} color={color} />,
    messagerie: (color) => <Entypo name="message" size={26} color={color} />
  };