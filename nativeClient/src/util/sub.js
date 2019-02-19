const sub = (basic, junk, flag) => {
    if (flag === INSERT_N) {
        basic = basic.substr(0, 2) + '\n' + basic.substr(2);
    }
    return basic.replace(new RegExp(junk, 'g'), '');
};

export const INSERT_N = 'SUB/INSERT_\\n';

export default sub;