/**
 *
 * @author wxik
 * @sine 2020-07-07 20:21
 */

import React, {FC, RefObject, useImperativeHandle, useRef, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';

interface IProps {
  color: string;
  placeholderColor: string;
  backgroundColor: string;
  onDone: (param: {title?: string; url?: string}) => void;
  forwardRef: RefObject<any>;
}

export const InsertLinkModal: FC<IProps> = ({color, placeholderColor, backgroundColor, onDone, forwardRef}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const dataRef = useRef<{title?: string; url?: string}>({});

  const setTitle = (title: string) => {
    dataRef.current.title = title;
  };

  const setURL = (url: string) => {
    dataRef.current.url = url;
  };

  const handleDone = () => {
    setModalVisible(false);
    onDone(dataRef.current);
  };

  useImperativeHandle(
    forwardRef,
    () => {
      return {
        setModalVisible,
      };
    },
    [],
  );

  return (
    <Modal
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      coverScreen={false}
      isVisible={isModalVisible}
      backdropColor={color}
      backdropOpacity={0.3}
      onBackdropPress={() => setModalVisible(false)}>
      <View style={[styles.dialog, {backgroundColor}]}>
        <View style={styles.linkTitle}>
          <Text style={{color}}>Insert Link</Text>
        </View>
        <View style={styles.item}>
          <TextInput
            style={[styles.input, {color}]}
            placeholderTextColor={placeholderColor}
            placeholder={'title'}
            onChangeText={text => setTitle(text)}
          />
        </View>
        <View style={styles.item}>
          <TextInput
            style={[styles.input, {color}]}
            placeholderTextColor={placeholderColor}
            placeholder="http(s)://"
            onChangeText={text => setURL(text)}
          />
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(false)}>
            <Text style={styles.text}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={handleDone}>
            <Text style={styles.text}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e8e8e8',
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 40,
  },
  linkTitle: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#b3b3b3',
  },
  dialog: {
    borderRadius: 8,
    marginHorizontal: 40,
    paddingHorizontal: 10,
  },

  buttonView: {
    flexDirection: 'row',
    height: 36,
    paddingVertical: 4,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#286ab2',
  },
});
