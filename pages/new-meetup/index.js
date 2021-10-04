import NewMeetupForm from "../../components/meetups/NewMeetupForm";
import { useRouter } from "next/router";
import { Fragment } from "react";
import Head from "next/head";

function NewMeetupPage() {
	const router = useRouter();

	const addMeetupHandler = async (meetupData) => {
		const response = await fetch("/api/new-meetup", {
			method: "POST",
			body: JSON.stringify(meetupData),
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();
		console.log(data);
		router.push("/");
	};

	return (
		<Fragment>
			<Head>
				<title>React Meetups</title>
				<meta
					name="description"
					content="Add your own meetups and create amazing networking opportunities"
				/>
			</Head>
			<NewMeetupForm onAddMeetup={addMeetupHandler} />
		</Fragment>
	);
}

export default NewMeetupPage;
