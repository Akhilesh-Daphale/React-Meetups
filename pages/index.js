import Head from "next/head";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from "react";

function HomePage(props) {
	return (
		<Fragment>
			<Head>
				<title>React Meetups</title>
				<meta
					name="description"
					content="Browse a huge list of hight active React Meetups"
				/>
			</Head>
			<MeetupList meetups={props.meetups} />
		</Fragment>
	);
}

// This function will run always after deployment i.i gets updated for every request which means we have to wait for the request to occur.
// The context parameter gives the request and response object which is an extra data
// export async function getServerSideProps(context) {
//     const req = context.req;
//     const res = context.res;

//     // Fetch data from API
//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     };
// }

// For pre-rendering so that the list items are seen in the page source, if we do this by using the useEffect hook in compoenent it will not be shown
// The function name should be exact bcz it is reserved name.
// NextJS will not directly call the component function rather it will first call the staticProps function
// This function will not be executed on the client side and it will never end up on the client side.
// It can be used to make secure calls to any API or database.
// The props object name in the return object must be same rest can be user's choice.
// The revalidate property validates this page during build process every number of seconds is assigned to it.
// Page is faster with this function
export async function getStaticProps() {
	const client = await MongoClient.connect("mongodb://localhost:27017/test");
	const db = client.db();
	const meetupsCollection = db.collection("meetups");
	const result = await meetupsCollection.find().toArray();
	client.close();

	const meetups = result.map((meetup) => ({
		title: meetup.title,
		address: meetup.address,
		image: meetup.image,
		id: meetup._id.toString(),
	}));

	return {
		props: {
			meetups: meetups,
		},
		revalidate: 1,
	};
}

export default HomePage;
