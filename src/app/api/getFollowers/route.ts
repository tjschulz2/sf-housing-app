// import { NextResponse } from "next/server";
// import { fetchWithToken } from '../apiHelper';

// const DATA_SOURCE_URL = "https://api.twitter.com/2/users/946482612167639040/followers"

// export async function GET() {
//     let cursor = null;
//     let getFollowers: User[] = [];

//     do {
//         const res = await fetchWithToken(
//             `${DATA_SOURCE_URL}${cursor ? `?pagination_token=${cursor}` : ''}`
//         );

//         const data = await res.json();
//         getFollowers = [...getFollowers, ...data.data];
//         cursor = data.meta.next_token;
//     } while (cursor);

//     return NextResponse.json(getFollowers);
// }