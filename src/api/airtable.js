// const baseId = import.meta.env.VITE_BASE_ID;
// const tableName = import.meta.env.VITE_TABLE_NAME;
// const token = import.meta.env.VITE_API_KEY;

// console.log('Base ID=:', baseId);
// console.log('Table Name=:', tableName);
// export const URL = `https://api.airtable.com/v0/${baseId}/${tableName}`;

// export const fetchFromAirtable = async (url = URL) => {
//   const response = await fetch(url, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   if (!response.ok) {
//     throw new Error(`HTTP Error ${response.status}`);
//   }
//   return response.json();
// };
