import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import React from 'react';
import { DefaultStyles } from '../../styles/DefaultStyles';
import { scaleModerate } from '../../styles/scaleDimensions';
import { Colors } from '../../styles/Colors';

interface IInput extends TextInputProps {
  title?: string;
  error?: boolean;
  message?: string;
  containerStyle?: ViewStyle;
  area?: boolean;
  inputStyle?: TextStyle;
}

const Input = (props: IInput) => {
  return (
    <View style={[props?.containerStyle]}>
      <View
        style={[
          styles.wrapInput,
          props?.editable === false && { borderColor: '#706f6f' },
          props?.error && { borderColor: Colors.redFD },
          props?.area && { height: scaleModerate(100) },
        ]}
      >
        {props?.title && (
          <View>
            <Text
              style={[
                styles.title,
                props?.editable === false && { color: '#706f6f' },
              ]}
            >
              {props?.title}
            </Text>
          </View>
        )}

        <TextInput
          multiline={props?.area}
          selectionColor={'#626161'}
          editable={props?.editable !== false}
          style={[
            styles.input,
            {
              marginTop: props?.title ? scaleModerate(15) : 0,
              fontSize: props?.title ? scaleModerate(13) : scaleModerate(14),
            },
            props?.editable === false && { color: '#706f6f' },
            props?.area && {
              height: scaleModerate(70),
              marginTop: props?.title ? scaleModerate(15) : 0,
              textAlignVertical: 'top',
            },
            props?.inputStyle,
          ]}
          {...props}
        />
      </View>

      {props?.message && <Text style={styles.message}>{props?.message}</Text>}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  title: {
    position: 'absolute',
    top: scaleModerate(8),
    ...DefaultStyles.textBold12Black,
    backgroundColor: Colors.whiteFF,
    paddingHorizontal: scaleModerate(5),
    fontSize: scaleModerate(12),
  },
  wrapInput: {
    borderWidth: scaleModerate(1),
    height: scaleModerate(54),
    borderRadius: scaleModerate(8),
    borderColor: Colors.whiteE6,
    backgroundColor: Colors.whiteFF,
    paddingHorizontal: scaleModerate(10),
  },
  input: {
    flex: 1,
    ...DefaultStyles.textRegular14Black,
  },
  message: {
    marginTop: scaleModerate(5),
    marginLeft: scaleModerate(10),
    ...DefaultStyles.textRegular12Red,
  },
});
