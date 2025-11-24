// components/ui/TText.tsx
import { StyleSheet, Text, TextProps } from "react-native";
import { textShadow, theme } from "../../lib/theme";

type Props = TextProps & {
  variant?: "heading" | "subheading" | "body" | "caption";
  muted?: boolean;
};

export function TText({ variant = "body", muted, style, ...rest }: Props) {
  return (
    <Text
      {...rest}
      style={[
        styles.base,
        variantStyles[variant],
        muted && styles.muted,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    color: theme.colors.text,
    fontFamily: theme.fonts.body,
  },
  muted: {
    color: theme.colors.textMuted,
  },
});

const variantStyles = StyleSheet.create({
  heading: {
    fontFamily: theme.fonts.heading,
    fontSize: 30,
    letterSpacing: 1,
    color: theme.colors.goldBright,
    ...textShadow,
  },
  subheading: {
    fontFamily: theme.fonts.body,
    fontSize: 16,
    color: theme.colors.text,
    ...textShadow,
  },
  body: {
    fontFamily: theme.fonts.body,
    fontSize: 14,
    ...textShadow,
  },
  caption: {
    fontFamily: theme.fonts.body,
    fontSize: 12,
    ...textShadow,
  },
});
