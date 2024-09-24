import { NextResponse } from 'next/server';

export async function POST(request) {
    const { email, newAddress } = await request.json();

    const SHOPIFY_API_URL = `${process.env.SHOPIFY_SHOP}/admin/api/2024-07/customers.json`;
    const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

    try {
        // Validate newAddress structure
        const requiredFields = ['firstName', 'lastName', 'address1', 'city', 'province', 'country', 'zip', 'phone'];
        for (const field of requiredFields) {
            if (!newAddress[field]) {
                return NextResponse.json({ error: `${field} is required.` }, { status: 400 });
            }
        }

        // Fetch the customer based on the email
        const customerResponse = await fetch(`${SHOPIFY_API_URL}?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
            },
        });

        if (!customerResponse.ok) {
            const errorData = await customerResponse.json();
            console.error('Error fetching customer:', errorData);
            return NextResponse.json({ error: errorData.errors }, { status: customerResponse.status });
        }

        const { customers } = await customerResponse.json();

        // If customer not found, proceed to create a new customer
        if (!customers || customers.length === 0) {
            // Create a new customer since none is found
            const createCustomerResponse = await fetch(SHOPIFY_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
                },
                body: JSON.stringify({
                    customer: {
                        email,
                        addresses: [{
                            first_name: newAddress.firstName,
                            last_name: newAddress.lastName,
                            address1: newAddress.address1,
                            city: newAddress.city,
                            province: newAddress.province,
                            country: newAddress.country,
                            zip: newAddress.zip,
                            phone: newAddress.phone,
                        }],
                    },
                }),
            });

            if (!createCustomerResponse.ok) {
                const errorData = await createCustomerResponse.json();
                console.error('Error creating customer:', errorData);
                return NextResponse.json({ error: errorData.errors || 'Failed to create customer' }, { status: 422 });
            }

            const newCustomer = await createCustomerResponse.json();
            return NextResponse.json(newCustomer, { status: 201 });
        }

        const customer = customers[0];
        const customerId = customer.id;

        // Retrieve existing addresses for the customer
        const addressesResponse = await fetch(`${process.env.SHOPIFY_SHOP}/admin/api/2024-07/customers/${customerId}/addresses.json`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
            },
        });

        if (!addressesResponse.ok) {
            const errorData = await addressesResponse.json();
            console.error('Error fetching addresses:', errorData);
            return NextResponse.json({ error: errorData.errors }, { status: addressesResponse.status });
        }

        const { addresses } = await addressesResponse.json();

        if (addresses.length > 0) {
            const addressId = addresses[0].id; // Update the first address

            const updateAddressResponse = await fetch(`${process.env.SHOPIFY_SHOP}/admin/api/2024-07/customers/${customerId}/addresses/${addressId}.json`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
                },
                body: JSON.stringify({
                    address: {
                        first_name: newAddress.firstName,
                        last_name: newAddress.lastName,
                        address1: newAddress.address1,
                        city: newAddress.city,
                        province: newAddress.province,
                        country: newAddress.country,
                        zip: newAddress.zip,
                        phone: newAddress.phone,
                    },
                }),
            });

            if (!updateAddressResponse.ok) {
                const errorData = await updateAddressResponse.json();
                console.error('Error updating address:', errorData);
                return NextResponse.json({ error: errorData.errors || 'Failed to update address' }, { status: 422 });
            }

            const updatedAddress = await updateAddressResponse.json();
            console.log('Updated address:', updatedAddress);
            return NextResponse.json(updatedAddress, { status: 200 });
        } else {
            // Create a new address since none exist
            const createAddressResponse = await fetch(`${process.env.SHOPIFY_SHOP}/admin/api/2024-07/customers/${customerId}/addresses.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
                },
                body: JSON.stringify({
                    address: {
                        first_name: newAddress.firstName,
                        last_name: newAddress.lastName,
                        address1: newAddress.address1,
                        city: newAddress.city,
                        province: newAddress.province,
                        country: newAddress.country,
                        zip: newAddress.zip,
                        phone: newAddress.phone,
                    },
                }),
            });

            if (!createAddressResponse.ok) {
                const errorData = await createAddressResponse.json();
                console.error('Error creating address:', errorData);
                return NextResponse.json({ error: errorData.errors || 'Failed to create address' }, { status: 422 });
            }

            const createdAddress = await createAddressResponse.json();
            return NextResponse.json(createdAddress, { status: 201 });
        }
    } catch (error) {
        console.error('Internal Server Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
