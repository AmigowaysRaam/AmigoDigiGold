import React, { useMemo, useState } from 'react';
import {
    Modal, View, Text, StyleSheet, FlatList, Pressable,
    TextInput,
} from 'react-native';
import { wp } from '../resources/dimensions';
import { COLORS } from '../resources/colors';
const COUNTRY_LIST = [
    { name: 'India', code: '+91', iso: 'IN' },
    { name: 'United States', code: '+1', iso: 'US' },
    { name: 'United Kingdom', code: '+44', iso: 'GB' },
    { name: 'Canada', code: '+1', iso: 'CA' },
    { name: 'Australia', code: '+61', iso: 'AU' },
    { name: 'Germany', code: '+49', iso: 'DE' },
    { name: 'France', code: '+33', iso: 'FR' },
    { name: 'Singapore', code: '+65', iso: 'SG' },
    { name: 'Malaysia', code: '+60', iso: 'MY' },
    { name: 'UAE', code: '+971', iso: 'AE' },
    { name: 'Saudi Arabia', code: '+966', iso: 'SA' },
    { name: 'Qatar', code: '+974', iso: 'QA' },
];
export default function CountryCodeModal({
    visible, onClose, onSelect,
}) {
    const [search, setSearch] = useState('');
    const filteredCountries = useMemo(() => {
        return COUNTRY_LIST.filter(item =>
            item.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [search]);
    const handleSelect = item => {
        onSelect(item); setSearch(''); onClose();
    };
    return (
        <Modal
            visible={visible}
            animationType="none"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        Select Country
                    </Text>

                    <TextInput
                        placeholder="Search country..."
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchInput}
                        placeholderTextColor={'#999'}
                    />

                    <FlatList
                        data={filteredCountries}
                        keyExtractor={item => item.iso}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <Pressable
                                style={styles.countryItem}
                                onPress={() =>
                                    handleSelect(item)
                                }
                            >
                                <Text style={styles.countryName}>
                                    {item.name}
                                </Text>

                                <Text style={styles.countryCode}>
                                    {item.code}
                                </Text>
                            </Pressable>
                        )}
                    />

                    <Pressable
                        style={styles.closeBtn}
                        onPress={onClose}
                    >
                        <Text style={styles.closeText}>
                            Close
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'center', alignItems: 'center',
    }, container: {
        height: '75%', backgroundColor: '#FFF', padding: wp(5),
        borderRadius: 12, width: '95%',
    },
    title: {
        fontSize: wp(5), marginBottom: 15,
        fontFamily: 'Poppins_600SemiBold',
        color: COLORS?.primary
    }, searchInput: {
        borderWidth: 1, borderColor: '#E5E5E5',
        borderRadius: 4, paddingHorizontal: 15, height: wp(12),
        marginBottom: 15,
        fontFamily: 'Poppins_600SemiBold',
    }, countryItem: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F2F2F2',
    },
    countryName: { fontSize: 16, color: '#222', }, countryCode: {
        fontSize: wp(4), fontFamily: 'Poppins_600SemiBold',
    }, closeBtn: {
        marginTop: 10, height: 50,
        borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS?.primary
    },
    closeText: {
        color: '#FFF', fontFamily: 'Poppins_600SemiBold',
    },
});