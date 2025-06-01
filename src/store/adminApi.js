import { ActionTypes } from "./actionTypes"; // Adjust path if needed
import axios from "axios";

export async function fetchAdminItems() {
  const response = await fetch("http://localhost:8087/api/admin/get-items");
  if (!response.ok) {
    throw new Error("Failed to fetch admin items");
  }
  return await response.json();
}

export async function performAdminAction(actionType, itemIds) {
  const response = await fetch("http://localhost:8087/api/admin/perform", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ actionType, itemIds }),
  });
  if (!response.ok) {
    throw new Error("Failed to perform action");
  }
  return await response.text();
}
