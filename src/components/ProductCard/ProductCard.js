import React from 'react';
import './ProductCard.scss';

const ProductCard = props => {
	const { record } = props;
	return (
		<div className='ProductCard'>
			<div className='Col'>
				<div>
					<strong>Service Name:</strong>
					<span>{record?.ServiceName}</span>
				</div>
				<div className='BadgeWrapper'>
					{Object.keys(record?.Tags || {}).map(key => {
						return (
							<div key={key} className='Badge'>
								{record?.Tags?.[key]}
							</div>
						);
					})}
				</div>
				<div>
					<strong>Category:</strong>
					<span>{record?.MeterCategory}</span>
				</div>
				<div>
					<strong>Location:</strong>
					<span>{record?.Location}</span>
				</div>
			</div>
			<div className='Col'>
				<div>
					<strong>Instance ID:</strong>
					<span>{record?.InstanceId}</span>
				</div>
				<div>
					<strong>Unit Of Masure:</strong>
					<span>{record?.UnitOfMeasure}</span>
				</div>
				<div>
					<strong>Cost:</strong>
					<span>${record?.Cost}</span>
				</div>
				<div>
					<strong>Date:</strong>
					<span>{record?.Date}</span>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
