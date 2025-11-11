const axios = require("axios");

async function main() {
  try {
    // Step 1: Generate webhook
    const generateUrl = "https://bfhldevapigw.healthrx.co.in/hiring/generateWebhook/JAVA";

    const body = {
      name: "Shanthi V",
      regNo: "REG12347", 
      email: "shanthi@example.com"
    };

    const generateResponse = await axios.post(generateUrl, body);
    console.log("Webhook generated successfully!");
    console.log(generateResponse.data);

    // Extract webhook URL and token
    const webhookUrl = generateResponse.data.webhook;
    const accessToken = generateResponse.data.accessToken;

    // Step 2: Define both SQL queries
    // --- Question 1 ---
    const query1 = `
    SELECT 
        P.AMOUNT AS SALARY,
        CONCAT(E.FIRST_NAME, ' ', E.LAST_NAME) AS NAME,
        TIMESTAMPDIFF(YEAR, E.DOB, CURDATE()) AS AGE,
        D.DEPARTMENT_NAME
    FROM PAYMENTS P
    JOIN EMPLOYEE E ON P.EMP_ID = E.EMP_ID
    JOIN DEPARTMENT D ON E.DEPARTMENT = D.DEPARTMENT_ID
    WHERE DAY(P.PAYMENT_TIME) != 1
    ORDER BY P.AMOUNT DESC
    LIMIT 1;
    `;
    
    // --- Question 2 ---
    const query2 = `
    SELECT 
        E1.EMP_ID,
        E1.FIRST_NAME,
        E1.LAST_NAME,
        D.DEPARTMENT_NAME,
        COUNT(E2.EMP_ID) AS YOUNGER_EMPLOYEES_COUNT
    FROM EMPLOYEE E1
    JOIN DEPARTMENT D ON E1.DEPARTMENT = D.DEPARTMENT_ID
    LEFT JOIN EMPLOYEE E2
        ON E1.DEPARTMENT = E2.DEPARTMENT
        AND E2.DOB > E1.DOB
    GROUP BY E1.EMP_ID, E1.FIRST_NAME, E1.LAST_NAME, D.DEPARTMENT_NAME
    ORDER BY E1.EMP_ID DESC;
    `;

    // Step 3: Submit first query
    console.log("\nSubmitting Query 1 (Highest Salary)...\n");
    const submit1 = await axios.post(
      webhookUrl,
      { finalQuery: query1 },
      { headers: { Authorization: accessToken } }
    );
    console.log("Query 1 submitted successfully!");
    console.log(submit1.data);

    // Step 4: Submit second query
    console.log("\nSubmitting Query 2 (Younger Employees Count)...\n");
    const submit2 = await axios.post(
      webhookUrl,
      { finalQuery: query2 },
      { headers: { Authorization: accessToken } }
    );
    console.log("Query 2 submitted successfully!");
    console.log(submit2.data);

  } 
  catch (error) {
    console.error("\nSomething went wrong:\n");
    if (error.response) {
      console.error(error.response.data);
    } 
    else {
      console.error(error.message);
    }
  }
}

main();
