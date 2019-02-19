const getColor = () => {
    const COLOR_S = ['#84abf0', '#e1b5f2', '#9ceda2', '#edc29c', '#41e081', '#e04141'];
    const colorCount = COLOR_S.length;
    return COLOR_S[parseInt(Math.random() * (colorCount - 1))];
};

export default getColor;