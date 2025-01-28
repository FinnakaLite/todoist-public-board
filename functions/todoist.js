// functions/todoist.js
export async function onRequest(context) {
    const { request } = context;
    const API_TOKEN = process.env.TODOIST_API_TOKEN; // Use your environment variable
  
    if (request.method === "POST") {
      const body = await request.json();
      const { content, project_id, labels, due } = body;
  
      const response = await fetch("https://api.todoist.com/rest/v2/tasks", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          project_id,
          labels,
          due,
        }),
      });
  
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    return new Response("Method not allowed", { status: 405 });
  }