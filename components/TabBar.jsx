import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import TabBarButton from './TabBarButtons';

const { width } = Dimensions.get('window');
const primaryColor = '#0891b2';
const greyColor = '#737373';

const TabBar = ({ state, descriptors, navigation, isVisible }) => {
  // If the tab bar is not visible, return null
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key] || {};
        const label = options.tabBarLabel ?? options.title ?? route.name;

        // Skip rendering for specific routes
        if (['_sitemap', '+not-found', 'profile/DemandeAbsence'].includes(route.name)) {
          return null;
        }

        const isFocused = state.index === index;
        const color = isFocused ? primaryColor : greyColor;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          // Navigate to the route if it's not already focused
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            style={styles.tabbarItem}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={color}
            label={label}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 0,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabBar;
// components/TabBar.jsx
// import React from 'react';
// import { View, StyleSheet, Dimensions, Platform } from 'react-native';
// import TabBarButton from './TabBarButtons';
// import { Ionicons } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');
// const primaryColor = '#0891b2';
// const greyColor = '#737373';

// const TabBar = ({ state, descriptors, navigation, isVisible }) => {
//   if (!isVisible) return null;

//   return (
//     <View style={styles.tabbar}>
//       {state.routes.map((route, index) => {
//         const { options } = descriptors[route.key] || {};
//         const label = options.tabBarLabel ?? options.title ?? route.name;

//         if (['_sitemap', '+not-found', 'profile/DemandeAbsence'].includes(route.name)) {
//           return null;
//         }

//         const isFocused = state.index === index;
//         const color = isFocused ? primaryColor : greyColor;

//         const onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//             canPreventDefault: true,
//           });

//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name, route.params);
//           }
//         };

//         const onLongPress = () => {
//           navigation.emit({
//             type: 'tabLongPress',
//             target: route.key,
//           });
//         };

//         let iconName;
//         switch (route.name) {
//           case 'Dashboard':
//             iconName = 'home';
//             break;
//           case 'Chantier':
//             iconName = 'construct';
//             break;
//           case 'Profile':
//             iconName = 'person';
//             break;
//           case 'Messaging': // Updated to use MessagingTab
//             iconName = 'chatbubbles';
//             break;
//           default:
//             iconName = 'square';
//         }

//         return (
//           <TabBarButton
//             key={route.name}
//             style={styles.tabbarItem}
//             onPress={onPress}
//             onLongPress={onLongPress}
//             isFocused={isFocused}
//             routeName={route.name}
//             color={color}
//             label={label}
//             iconName={iconName}
//           />
//         );
//       })}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   tabbar: {
//     position: 'absolute',
//     bottom: Platform.OS === 'ios' ? 20 : 0,
//     width: width,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     paddingVertical: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//     elevation: 5,
//     shadowColor: 'black',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   tabbarItem: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// export default TabBar;