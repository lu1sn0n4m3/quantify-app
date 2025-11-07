import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '../../theme/colors';

export type TabIconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

const DEFAULT_SIZE = 26;
const DEFAULT_STROKE_WIDTH = 1.8;

export const HomeIcon: React.FC<TabIconProps> = ({
  size = DEFAULT_SIZE,
  color = colors.ink,
  strokeWidth = DEFAULT_STROKE_WIDTH,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3.5 11L12 3.5L20.5 11"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.5 10.5V20.5H18.5V10.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const MarketIcon: React.FC<TabIconProps> = ({
  size = DEFAULT_SIZE,
  color = colors.ink,
  strokeWidth = DEFAULT_STROKE_WIDTH,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="m5.5 15 4.5-5 3.5 3.5 5-6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={5.5} cy={15} r={1.1} fill={color} />
    <Circle cx={10} cy={10} r={1.1} fill={color} />
    <Circle cx={13.5} cy={13.5} r={1.1} fill={color} />
    <Circle cx={18.5} cy={7.5} r={1.1} fill={color} />
  </Svg>
);

export const ChatIcon: React.FC<TabIconProps> = ({
  size = DEFAULT_SIZE,
  color = colors.ink,
  strokeWidth = DEFAULT_STROKE_WIDTH,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5.5 6.5C5.5 5.67 6.17 5 7 5H17C17.83 5 18.5 5.67 18.5 6.5V13.5C18.5 14.33 17.83 15 17 15H10L6.5 18.5V6.5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 9H15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M9 11.5H13.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const AccountIcon: React.FC<TabIconProps> = ({
  size = DEFAULT_SIZE,
  color = colors.ink,
  strokeWidth = DEFAULT_STROKE_WIDTH,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx={12}
      cy={8.5}
      r={3}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Path
      d="M5.5 19.5c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);


