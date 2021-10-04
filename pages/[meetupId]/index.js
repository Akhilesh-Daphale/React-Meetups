import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { Fragment } from "react";
import Head from "next/head";

function MeetupDetails(props) {
	const { image, title, address, description } = props.meetupData;

	return (
		<Fragment>
			<Head>
				<title>{title}</title>
				<meta
					name="description"
					content={description}
				/>
			</Head>
			<MeetupDetail
				image={image}
				title={title}
				address={address}
				description={description}
			/>
		</Fragment>
	);
}

// When using getStaticProps function and the page is a dynamic page we have to use the getStaticPaths function
// The dynamic values have to be declared
export async function getStaticPaths() {
	const client = await MongoClient.connect("mongodb://localhost:27017/test");
	const db = client.db();
	const meetupsCollection = db.collection("meetups");
	// Only give the id
	const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
	client.close();

	return {
		fallback: false,
		paths: meetups.map((meetup) => ({
			params: { meetupId: meetup._id.toString() },
		})),
	};
}

// Cannot use the useRouter hook to get the meetupId instead use the context
// Using this function the page is pre-generated during the build process
// This page has to be pre-generated for all possible dynamic values and for any value if it is not done then it will give 404 error.
export async function getStaticProps(context) {
	const meetupId = context.params.meetupId;

	const client = await MongoClient.connect("mongodb://localhost:27017/test");
	const db = client.db();
	const meetupsCollection = db.collection("meetups");
	// Search by id
	const selectedMeetup = await meetupsCollection.findOne({
		_id: ObjectId(meetupId),
	});
	client.close();

	return {
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(),
				title: selectedMeetup.title,
				image: selectedMeetup.image,
				address: selectedMeetup.address,
				description: selectedMeetup.description,
			},
		},
	};
}

export default MeetupDetails;
