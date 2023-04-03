import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';

import ProductCard from 'components/ProductCard';

import { GET_APPLICATIONS, GET_RAW_DATA, GET_RESOURCES } from 'api/const';
import { TABS } from './const';
import './Home.scss';

const Home = props => {
	const [selectedTab, setSelectedTab] = useState(TABS.applicants);
	const [loadingRecords, setLoadingRecords] = useState(false);
	const [records, setRecords] = useState([]);

	const getRawData = useCallback(async () => {
		try {
			setLoadingRecords(true);
			const res = await axios.get(GET_RAW_DATA);
			setRecords(res?.data || []);
		} catch (error) {
		} finally {
			setLoadingRecords(false);
		}
	}, []);

	const createFilters = useCallback(async () => {
		try {
			if (!selectedTab) return;
			const res = await axios.get(
				selectedTab === TABS.applicants ? GET_APPLICATIONS : GET_RESOURCES
			);
			setRecords(res?.data || []);
		} catch (error) {
			console.error(error);
		} finally {
		}
	}, [selectedTab]);

	useEffect(() => {
		if (!selectedTab) return;
		getRawData().then(res => createFilters());
	}, [selectedTab, getRawData, createFilters]);

	return (
		<div className='HomeWrapper'>
			<div className='Container'>
				<div className='FilterWrapper'>
					<div className='ToggleButtonGroup'>
						<button
							className={selectedTab === TABS.applicants ? 'active' : ''}
							onClick={() => setSelectedTab(TABS.applicants)}>
							Applications
						</button>
						<button
							className={selectedTab === TABS.applicants ? 'resources' : ''}
							onClick={() => setSelectedTab(TABS.resources)}>
							Resources
						</button>
					</div>
					<div>Select</div>
				</div>
				<div className='ContentWrapper'>
					{loadingRecords ? (
						<div className='LoadingWrapper'>
							<p>Fetching Records...</p>
						</div>
					) : (
						<>
							<p className='Records'>200 records found</p>
							{records.map(record => {
								return <ProductCard key={record.id} record={record} />;
							})}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
