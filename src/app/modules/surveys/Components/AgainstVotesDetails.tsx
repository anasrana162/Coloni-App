import { View, Text, FlatList, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { customMargin, customPadding, globalStyles } from '../../../assets/global-styles/global.style.asset';
import rs from '../../../assets/global-styles/responsiveSze.style.asset';
import { colors } from '../../../assets/global-styles/color.assets';
import { typographies } from '../../../assets/global-styles/typography.style.asset';
import surveysService from '../../../services/features/surveys/surveys.service';
import { apiResponse } from '../../../services/features/api.interface';
import { useCustomNavigation } from '../../../packages/navigation.package';
import { showMessage } from 'react-native-flash-message';
import { formatDate } from '../../../utilities/helper';
import EmptyContent from '../../../components/core/EmptyContent.core.component';

const AgainstVotesDetails: React.FC<{ id: string }> = ({ id }) => {
  const { t: trans } = useTranslation();
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const navigation = useCustomNavigation<any>();
  
  const fetchData = async () => {
    setLoading(true); 
    const result = await surveysService.details(id);
    const { status, body, message } = result as apiResponse;

    if (status) {
      setData(body);
    } else {
      navigation.goBack();
      showMessage({ message });
    }
    setLoading(false);
  };

  useLayoutEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const AgainstDataList = data?.againstData || [];
  const renderVoteItem = ({ item }: { item: any }) => (
    
    <View style={styles.subContainer}>
      <View style={styles.leftContainer}>
        <Text style={styles.userName}>{item?.user?.name || trans('Unknown User')}</Text>
        <Text style={styles.deviceInfo}>
          {item?.user?.device?.deviceId || trans('Unknown Device')}
        </Text>
      </View>
      <Text style={styles.voteDate}>
        {formatDate(item?.timestamp, 'DD/MM/YYYY HH:mm:ss')}
      </Text>
    </View>
  );


//   return (
//     <View>
//       <FlatList
//         data={AgainstDataList}
//         renderItem={renderVoteItem}
//         keyExtractor={(item) => item?.user?.id?.toString() || Math.random().toString()}
//         // scrollEnabled={false}
//         contentContainerStyle={customPadding(10)}
//         ListEmptyComponent={
//             <EmptyContent
//               text={trans('There is no votes in against!')}
//               //forLoading={isLoading}
//             />
//           }
//       />
//     </View>
//   );
// };
return (
  <View>
    {loading ? (
      <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
    ) : (
      <FlatList
      data={AgainstDataList}
        renderItem={renderVoteItem}
        keyExtractor={(item) => item?.user?.id?.toString() || Math.random().toString()}
        contentContainerStyle={customPadding(10)}
        ListEmptyComponent={
          <EmptyContent
            text={trans('There are no votes in against!')}
          />
        }
      />
    )}
  </View>
);
};

const styles = StyleSheet.create({
  subContainer: {
    // ...customMargin(0, 20, 4, 20),
    ...customPadding(10, 10, 10, 10),
    // backgroundColor: colors.gray3,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: colors.gray5,
  },
  leftContainer: {
    flexDirection: 'column',
    flex: 1, 
  },
  userName: {
    ...typographies(colors).ralewayMedium12,
    color: colors.primary,
  },
  voteDate: {
    ...typographies(colors).ralewayMedium12,
    color: colors.primary,
  },
  deviceInfo: {
    ...typographies(colors).ralewayMedium12,
    color: colors.secondary,
  },
  spinner: {
    marginTop: 20,
  },
  
});

export default AgainstVotesDetails;
