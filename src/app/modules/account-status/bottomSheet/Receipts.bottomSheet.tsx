import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import { typographies } from '../../../assets/global-styles/typography.style.asset';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import { customPadding, globalStyles } from '../../../assets/global-styles/global.style.asset';
import { calculateCash } from '../../../utilities/helper';
import { momentTimezone } from '../../../packages/momentTimezone.package';
import accountStatusService from '../../../services/features/accountStatus/accountStatus.service';
import { apiResponse } from '../../../services/features/api.interface';
import { showMessage } from 'react-native-flash-message';


// interface Receipt {
//   date: string;
//   description: string;
//   amount: number;
// }

interface Props {
  id: any;
}
// interface Income {
//   _id:any,
//   date: string;
//   description: string;
//   amount: number;
// }
const ReceiptsBottomSheet: React.FC<Props> = ({ id }) => {
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState<[]>([]);
  const [incomes, setIncomes] = useState<[]>([]);

  const fetchData = async () => {
    setFetching(true);
    try {
      const result = await accountStatusService.reciptDetails(id);
      const { body } = result as apiResponse;

      const incomeData = body.list.flatMap((receipt: any) => receipt.incomes || []);
      setIncomes(incomeData);
    } catch (error) {
      console.error('Fetching details failed:', error);
      showMessage({ message: 'Error fetching details' });
    } finally {
      setFetching(false);
    }
  };
  const getItemCount = () => {
    return incomes.length;
  };
  useLayoutEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);
  const getTotalAmount = () => {
    return incomes.reduce((total, income: any) => total + income?.amount, 0);
  };
  const { t: trans } = useTranslation();
  const { colors } = useTheme() as any;

  const renderItem = ({ item }: { item: any }) => (
    <View
      style={[
        globalStyles.rowBetween,
        {
          ...customPadding(5, 10, 5, 10),
          borderBottomColor: colors.gray5,
          borderBottomWidth: rs(1),
          alignItems: 'flex-start',
        },
      ]}
    >
      <View>
        <Text
          style={[
            typographies(colors).ralewayMedium10,
            { color: colors.primary, lineHeight: rs(15) },
          ]}
        >
          {momentTimezone(item?.createdAt).format('DD/MM/YYYY')}
        </Text>
        <Text
          style={[
            typographies(colors).ralewayMedium10,
            { color: colors.gray3, lineHeight: rs(15) },
          ]}
        >
          {item?.resident?.street?.name} {item?.resident?.home}
        </Text>
      </View>
      <Text
        style={[
          typographies(colors).ralewayMedium10,
          { color: colors.primary, lineHeight: rs(15) },
        ]}
      >
        {calculateCash(item?.amount)}
      </Text>
    </View>
  );

  return (
    <View style={{ ...customPadding(0, 10, 20, 10) }}>
      <Text
        style={[
          typographies(colors).montserratSemibold16,
          {
            color: colors.primary,
            textAlign: 'center',
            paddingBottom: rs(22),
            borderBottomColor: colors.primary,
            borderBottomWidth: rs(1),
          },
        ]}
      >
        {trans('Receipts')}
      </Text>
      <View
        style={[
          globalStyles.rowBetween,
          {
            ...customPadding(8, 5, 8, 5),
            backgroundColor: colors.gray5,
            marginTop: rs(5),
          },
        ]}
      >
        <Text />
        <Text
          style={[typographies(colors).ralewayBold10, { color: colors.primary }]}
        >
          {trans('Share')}
        </Text>
        <Text
          style={[typographies(colors).ralewayBold10, { color: colors.primary }]}
        >
          {calculateCash(getTotalAmount())}  ({getItemCount()})
        </Text>

      </View>
      <FlatList
        data={incomes}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id + index}
        ListEmptyComponent={<Text style={styles.emptyText}>{trans('No receipts available')}</Text>}
        contentContainerStyle={{ paddingBottom: rs(10) }}
        refreshing={fetching}
        onRefresh={fetchData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyText: {
    textAlign: 'center',
    marginTop: rs(20),
    color: 'gray',
  },
});

export default ReceiptsBottomSheet;
