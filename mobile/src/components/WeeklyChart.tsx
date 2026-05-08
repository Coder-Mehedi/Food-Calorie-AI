import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Svg, {Rect, Text as SvgText, Line} from 'react-native-svg';
import {format, parseISO} from 'date-fns';

interface Props {
  data: {date: string; calories: number}[];
}

const chartWidth = Dimensions.get('window').width - 80;
const chartHeight = 180;
const barGap = 8;
const labelHeight = 24;
const barAreaHeight = chartHeight - labelHeight - 16;

export function WeeklyChart({data}: Props) {
  if (!data.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No data for this week</Text>
      </View>
    );
  }

  const maxCalories = Math.max(...data.map(d => d.calories), 1);
  const barWidth = (chartWidth - barGap * (data.length + 1)) / data.length;

  return (
    <Svg width={chartWidth} height={chartHeight}>
      {data.map((item, i) => {
        const barHeight = (item.calories / maxCalories) * (barAreaHeight - 10);
        const x = barGap + i * (barWidth + barGap);
        const y = barAreaHeight - barHeight;
        const label = format(parseISO(item.date), 'EEE');

        return (
          <React.Fragment key={i}>
            <Rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={4}
              fill={item.calories > 0 ? '#4CAF50' : '#E8F5E9'}
            />
            {item.calories > 0 && (
              <SvgText
                x={x + barWidth / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize={10}
                fill="#6B7280">
                {item.calories}
              </SvgText>
            )}
            <SvgText
              x={x + barWidth / 2}
              y={chartHeight - 4}
              textAnchor="middle"
              fontSize={11}
              fill="#6B7280">
              {label}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

const styles = StyleSheet.create({
  empty: {height: chartHeight, justifyContent: 'center', alignItems: 'center'},
  emptyText: {color: '#9CA3AF', fontSize: 14},
});
