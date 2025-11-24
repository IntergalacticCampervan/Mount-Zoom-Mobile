// components/ui/FullscreenModal.tsx
import { ReactNode, useEffect, useRef } from "react";
import {
    Animated,
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function FullscreenModal({ visible, onClose, children }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <Animated.View style={[styles.backdrop, { opacity }]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.closeZone} />
        </TouchableWithoutFeedback>
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.96)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeZone: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    width: "100%",
    height: "100%",
    paddingTop: 32,
    paddingBottom: 12,
    backgroundColor: "#000",
  },
});
