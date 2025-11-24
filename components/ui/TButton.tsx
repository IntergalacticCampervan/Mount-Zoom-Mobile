// components/ui/TButton.tsx
import { StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "../../lib/theme";
import { TText } from "./TText";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "ghost";
};

export function TButton({ label, onPress, variant = "primary" }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.base,
        variant === "primary" ? styles.primary : styles.ghost,
      ]}
      activeOpacity={0.8}
    >
      <TText
        variant="body"
        style={variant === "primary" ? styles.primaryText : styles.ghostText}
      >
        {label}
      </TText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.radius.round,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: theme.colors.goldSoft,
    borderColor: theme.colors.goldBright,
  },
  ghost: {
    borderColor: theme.colors.border,
  },
  primaryText: {
    color: theme.colors.goldBright,
  },
  ghostText: {
    color: theme.colors.text,
  },
});
