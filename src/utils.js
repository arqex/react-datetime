export const callHandler = (method, e) => {
	if (!method) return true;
	return method(e) !== false;
};

export const getKeyboardProps = (onClickHandler) => ({
	tabIndex: 0,
	onKeyDown: (e) => e.key !== 'Enter' || callHandler(onClickHandler, e),
});
