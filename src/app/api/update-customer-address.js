// import { NextResponse } from 'next/server';

// export async function PUT(req, { params }) {
//   const { customer_id } = params;

//   try {
//     const body = await req.json(); // Parse the request body
//     const response = await fetch(
//       `https://learning-with-rhb.myshopify.com/admin/api/2024-07/customers/${customer_id}/addresses.json`,
//       {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
//         },
//         body: JSON.stringify(body),
//       }
//     );

//     if (!response.ok) {
//       return NextResponse.json({ error: 'Failed to update address' }, { status: response.status });
//     }

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ error: 'Error updating address' }, { status: 500 });
//   }
// }
