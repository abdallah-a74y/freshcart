export const currency = value => `${Number(value || 0).toFixed(2)} EGP`;
export const imageOf = item => item?.imageCover || item?.image || item?.images?.[0] || 'https://placehold.co/500x500/f5f5f5/999?text=FreshCart';
