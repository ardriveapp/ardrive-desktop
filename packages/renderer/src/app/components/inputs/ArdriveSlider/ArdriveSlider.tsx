import React from "react";

import {
	Checkmark,
	SelectContainer,
	SliderContainer,
} from "./ArdriveSlider.styled";

const ArdriveSlider: React.FC<{
	variants: string[];
	name: string;
}> = ({ variants, name }) => {
	return (
		<SliderContainer>
			{variants.map((variant, i) => (
				<SelectContainer key={i} htmlFor={`${variant}_${i}`}>
					<input
						type="radio"
						defaultChecked={i === 0}
						id={`${variant}_${i}`}
						value={i}
						name={name}
					/>
					<Checkmark>{variant}</Checkmark>
				</SelectContainer>
			))}
		</SliderContainer>
	);
};

export default ArdriveSlider;
