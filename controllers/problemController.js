import axios from "axios";
import User from "../models/User.js";
import Schedule from "../models/Shedule.js";
const calculateFutureDate = (today, nextDay) => {
  return new Date(today.getTime() + nextDay * 24 * 60 * 60 * 1000);
};
// export const isSolved = async (req, res) => {
//   try {
//     const { user, email, problem, position } = req.query;
//     console.log("user ", user, "problem : ", problem, position);
//     // let result = await axios.get(
//     //   `https://alfa-leetcode-api.onrender.com/${user}/submission`
//     // );
//     // Usage

//     let result = await getLastSolvedProblem(user);

//     if (result.title == problem) {
//       //   let user = await User.findOne({ email });
//       //   if (!user) {
//       //     throw new Error("user not available");
//       //   }

//       //   user.problemList[position - 1].status = true;
//       //   await user.save();

//       /**above code was not working because mongodb wasn't able to see if inner object has changed or not */
//       await User.findOneAndUpdate(
//         { email },
//         { $set: { [`problemList.${position - 1}.status`]: true } },
//         { new: true, runValidators: true }
//       );
//       console.log("user update: ", user);

//       const today = new Date();

//       const intervals = [0, 3, 7, 16, 35, 75, 150];
//       const scheduledProblems = intervals.map((days) => {
//         const sheduleDate = calculateFutureDate(today, days);
//         return new Schedule({
//           email: email,
//           problem: problem,
//           position:position,
//           status: false,
//           dateToSolve: sheduleDate,
//         }).save();
//       });

//       await Promise.all(scheduledProblems);

//       return res.status(200).json({
//         success: true,
//       });
//     }
//     res.status(500).json({
//       success: false,
//     });
//   } catch (err) {
//     console.log("Err ", err);
//     res.status(500).json({
//       success: false,
//       err: "Something went wrong",
//     });
//   }
// };

// Handle problem completion status
export const isSolved = async (req, res) => {
  try {
    const { user, email, problem, position } = req.query;

    // checking if this problem is solved in leetcode or not
    // currently it checks only last solved problem, but there should be a way of checking problem solved today at any time
    /* const result = await getLastSolvedProblem(user);

    if (result.title !== problem) {
      return res.status(500).json({ success: false });
    }

    */

    await User.findOneAndUpdate(
      { email },
      { $set: { [`problemList.${position - 1}.status`]: true } },
      { new: true, runValidators: true }
    );

    await scheduleProblemRevisions()

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log("Error updating status:", err);
    return res.status(500).json({
      success: false,
      err: "Failed to update problem status"
    });
  }
};

// Schedule future revisions
const scheduleProblemRevisions = async (req, res) => {
  try {
    const { email, problem, position } = req.query;
    const today = new Date();
    const intervals = [0, 3, 7, 16, 35, 75, 150];
    
    const scheduledProblems = intervals.map((days) => {
      const scheduleDate = calculateFutureDate(today, days);
      return new Schedule({
        email,
        problem,
        position,
        status: false,
        dateToSolve: scheduleDate,
      }).save();
    });

    await Promise.all(scheduledProblems);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log("Error scheduling revisions:", err);
    return res.status(500).json({
      success: false,
      err: "Failed to schedule revisions"
    });
  }
};

export const unCheck = async (req, res) => {
  try {
    const { email, number } = req.body;
    console.log("Er mai ", email, number);
    await User.findOneAndUpdate(
      { email },
      { $set: { [`problemList.${number - 1}.status`]: false } },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log("56 err ", err);
    res.status(500).json({
      success: false,
    });
  }
};

async function getLastSolvedProblem(username) {
  const query = `
    query recentSubmissions($username: String!) {
      recentSubmissionList(username: $username, limit: 10) {
        title
        timestamp
        statusDisplay
        lang
      }
    }
  `;

  const variables = { username };

  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      { query, variables },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const submissions = response.data.data.recentSubmissionList;
    // console.log("list ",submissions)
    return submissions[0];

    // Filter for 'Accepted' submissions and get the latest one
    // const lastSolved = submissions.find(
    //   (submission) => submission.statusDisplay === "Accepted"
    // );
    // if (lastSolved) {
    //   return {
    //     title: lastSolved.title,
    //     timestamp: new Date(lastSolved.timestamp * 1000), // Convert to JavaScript date format
    //     language: lastSolved.lang,
    //   };
    // } else {
    //   console.log("No solved problems found for this user.");
    //   return null;
    // }
  } catch (error) {
    console.error("Error fetching last solved problem:", error);
    return null;
  }
}

export const getTodaysProblem = async (req, res) => {
  console.log("getting todays problem")
  const today = new Date()
  today.setHours(0,0,0,0)

  const tommorow = new Date(today)
  tommorow.setDate(today.getDate()+1)

  const email = req.params.email
  const problemsToSolveToday = await Schedule.find({
    email,
    dateToSolve:{$gte:today,$lt:tommorow},
    status:false
  })
  
  console.log("getting todays problem 1 ",problemsToSolveToday)
  
  res.json({
    success:true,
    problemsToSolveToday
  })

};
