export const fetchSuspensionData = async (creatorId, setSuspensionData) => {
    try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(`http://localhost:8087/api/admin/creator/${creatorId}/suspension`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (data.message) {
            console.warn("No suspension details found.");
            return;
        }

        setSuspensionData(data);
    } catch (error) {
        console.error("Error fetching suspension data:", error);
    }
};
