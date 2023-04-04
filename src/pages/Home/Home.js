import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';

import ProductCard from 'components/ProductCard';

import { GET_APPLICATIONS, GET_RAW_DATA, GET_RESOURCES } from 'api/const';
import { initialFilter, CONST } from './const';
import './Home.scss';

const Home = props => {
	const [loadingRecords, setLoadingRecords] = useState(false);
	const [loadingFilters, setLoadingFilters] = useState(false);
	const [records, setRecords] = useState([]);
	const [filterRecords, setFilterRecords] = useState([]);
	const [filter, setFilter] = useState(initialFilter);
	const [applications, setApplications] = useState([]);
	const [resources, setResources] = useState([]);

	const getRawData = useCallback(async () => {
		try {
			setLoadingRecords(true);
			const res = await axios.get(GET_RAW_DATA);
			setRecords(res?.data || []);
			setFilterRecords(res?.data || []);
		} catch (error) {
		} finally {
			setLoadingRecords(false);
		}
	}, []);

	const toggleCheckList = data => {
		const { key, id } = data;
		const newFilter = _.cloneDeep(filter);
		// console.log('filter-data-', { data, newFilter });
		if (newFilter?.[key]?.includes(id)) {
			newFilter[key] = newFilter[key].filter(a => a !== id);
		} else {
			newFilter[key].push(id);
		}
		setFilter(newFilter);
	};

	useEffect(() => {
		if (Object?.keys(filter)?.length === 0 || records?.length === 0) return;
		setLoadingRecords(true);
		let newFilterRecords = _.cloneDeep(records);
		if (filter?.applications?.length > 0) {
			newFilterRecords = newFilterRecords.filter(f =>
				filter?.applications.includes(f.ServiceName)
			);
		}
		if (filter?.resources?.length > 0) {
			newFilterRecords = newFilterRecords.filter(f =>
				filter?.resources.includes(f.ServiceName)
			);
		}
		if (filter?.sort === 'LTH') {
			newFilterRecords = newFilterRecords.sort((a, b) => a.Cost - b.Cost);
		}
		if (filter?.sort === 'HTL') {
			newFilterRecords = newFilterRecords.sort((a, b) => b.Cost - a.Cost);
		}
		setFilterRecords(newFilterRecords);
		setLoadingRecords(false);
	}, [filter, records]);

	useEffect(() => {
		if (records?.length <= 0) return;
		const initializeFilters = async () => {
			try {
				setLoadingFilters(true);
				const applicationsRes = await axios.get(GET_APPLICATIONS);
				const resourcesRes = await axios.get(GET_RESOURCES);
				setApplications(applicationsRes?.data || []);
				setResources(resourcesRes?.data || []);
			} catch (error) {
				console.error(error);
			} finally {
				setFilter(initialFilter);
				setLoadingFilters(false);
			}
		};
		initializeFilters();
	}, [records]);

	useEffect(() => {
		getRawData();
	}, [getRawData]);

	return (
		<div className='HomeWrapper'>
			<div className='Container'>
				<div className='FilterWrapper'>
					<p className='Name'>Applications</p>
					<div>
						<ul className='CheckList'>
							{loadingFilters ? (
								<li>Loading....</li>
							) : (
								applications?.map(application => {
									return (
										<li key={application}>
											<input
												type='checkbox'
												id={application}
												checked={!!filter?.applications?.includes(application)}
												onChange={() =>
													toggleCheckList({
														key: CONST.applications,
														id: application,
													})
												}
											/>{' '}
											<label htmlFor={application}>{application}</label>
										</li>
									);
								})
							)}
						</ul>
					</div>
					<div className='Divider' />
					<p className='Name'>Resources</p>
					<div>
						<ul className='CheckList'>
							{loadingFilters ? (
								<li>Loading....</li>
							) : (
								resources?.map(resource => {
									return (
										<li key={resource}>
											<input
												type='checkbox'
												id={resource}
												checked={!!filter?.resources?.includes(resource)}
												onChange={() =>
													toggleCheckList({
														key: CONST.resources,
														id: resource,
													})
												}
											/>{' '}
											<label htmlFor={resource}>{resource}</label>
										</li>
									);
								})
							)}
						</ul>
					</div>
					<div className='Divider' />
				</div>
				<div className='ContentWrapper'>
					{loadingRecords ? (
						<div className='LoadingWrapper'>
							<p>Fetching Records...</p>
						</div>
					) : (
						<>
							<div className='SortWrapper'>
								<p className='Records'>
									{filterRecords?.length || 0} records found
								</p>
								<select
									onChange={e => {
										if (!e.target.value) return;
										const newFilter = _.cloneDeep(filter);
										newFilter.sort = e.target.value;
										setFilter(newFilter);
									}}>
									<option>Sort by cost</option>
									<option value='LTH'>Low to High</option>
									<option value='HTL'>Hight to Low</option>
								</select>
							</div>
							<div className='ListWrapper'>
								{filterRecords.map((record, recordIndex) => {
									return (
										<ProductCard
											key={`${record.InstanceId}${recordIndex}`}
											record={record}
										/>
									);
								})}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
