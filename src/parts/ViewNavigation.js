import React from 'react';
import { getKeyboardProps } from '../utils';

export default function ViewNavigation( { onClickPrev, onClickSwitch, onClickNext, switchContent, switchColSpan, switchProps } ) {
	return (
		<tr>
			<th className="rdtPrev" onClick={onClickPrev} {...getKeyboardProps(onClickPrev)}>
				<span>‹</span>
			</th>
			<th className="rdtSwitch" colSpan={switchColSpan} onClick={onClickSwitch} {...getKeyboardProps(onClickSwitch)} {...switchProps}>
				{ switchContent }
			</th>
			<th className="rdtNext" onClick={onClickNext} {...getKeyboardProps(onClickNext)}>
				<span>›</span>
			</th>
		</tr>
	);
}
