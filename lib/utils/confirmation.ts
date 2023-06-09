import { supabase } from '../supabaseClient';

export async function generateAndSendConfirmation(email: string): Promise<void> {
    const confirmationCode: number = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number

    const { error: deleteError } = await supabase
        .from('confirmation_codes')
        .delete()
        .eq('email', email);

    if (deleteError) {
        console.log('Error deleting: ', deleteError);
        throw new Error();
    } else {
    // Insert the new record
    const { error: insertError } = await supabase
        .from('confirmation_codes')
        .insert([
            { email: email, code: confirmationCode },
        ]);

        if (insertError) {
            console.log('Error inserting: ', insertError);
            throw new Error();
        } else {
            // Call the Zapier webhook
            const response = await fetch('/api/sendConfirmation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, confirmationCode }),
            });

            if (!response.ok) {
                const errorMessage: string = 'Error calling server-side function: ' + await response.text();
                console.error(errorMessage);
                throw new Error(errorMessage);
            }
        }
    }
}

export async function checkConfirmationCode(email: string, inputCode: number): Promise<boolean | Error> {
    // Fetch the record from the database where both email and code match the input
    const { data, error } = await supabase
        .from('confirmation_codes')
        .select('code') // We only need the code column
        .eq('email', email) // Where the email matches the input email
        .eq('code', inputCode) // AND the code matches the input code
        .single(); // We only expect a single record

    if (error) {
        console.log('Error fetching: ', error);
        throw new Error(error.message);
    }

    if (!data) {
        throw new Error("No data found for the given email and confirmation code");
    }

    return true;
}