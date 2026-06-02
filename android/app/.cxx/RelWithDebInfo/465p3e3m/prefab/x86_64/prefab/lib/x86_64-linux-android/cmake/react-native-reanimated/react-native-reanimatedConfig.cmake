if(NOT TARGET react-native-reanimated::reanimated)
add_library(react-native-reanimated::reanimated SHARED IMPORTED)
set_target_properties(react-native-reanimated::reanimated PROPERTIES
    IMPORTED_LOCATION "D:/QuizBee/node_modules/react-native-reanimated/android/build/intermediates/cxx/RelWithDebInfo/1n62251z/obj/x86_64/libreanimated.so"
    INTERFACE_INCLUDE_DIRECTORIES "D:/QuizBee/node_modules/react-native-reanimated/android/build/prefab-headers/reanimated"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

