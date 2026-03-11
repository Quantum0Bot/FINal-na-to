document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("map")) return;

    document.querySelectorAll(".room").forEach(room => {
        room.addEventListener("click", () => {
            const roomId = parseInt(room.dataset.room);
            // Room 41 is not clickable - it's still a room but not interactive
            if (roomId === 41) return;
            // For rounded rooms (r32-r37), show image-only popup
            if (roomId >= 32 && roomId <= 37) {
                openImagePopup(roomId);
            } else {
                openRoom(roomId);
            }
        });
    });

document.querySelectorAll(".circle").forEach(btn => {
        btn.addEventListener("click", () => {
            const disasterType = btn.innerText.trim();
            currentDisaster = disasterType;
            
            if (currentMode === "safe-zone") {
                // When in safe-zone mode and a disaster is clicked, apply safe zone colors for that disaster
                applySafeZone(disasterType);
            } else {
                applyMode(disasterType);
            }
        });
    });

    document.getElementById("room-btn").onclick = () => switchMode("rooms");
    document.getElementById("building-btn").onclick = () => switchMode("buildings");
    document.getElementById("floor-btn").onclick = () => switchFloor();
    document.getElementById("safe-zone-btn").onclick = () => switchMode("safe-zone");

    document.getElementById("room-btn").classList.add("active");
    document.querySelector(".circle").classList.add("active");
    
    // Apply default Flood mode on page load
    applyMode("Flood");
});


/* ROOM DATA */
const roomData = {
    1: { images: ["pictures/B1R2 1.jpeg", "pictures/B1R2 2.jpeg", "pictures/B1R2 3.jpeg"], name: "Room 2", info: "Adviser: <b>Placeholder</b><br>Room size: <b> 7 x 9 Meters </b><br>Room estimated capacity: <b>45 persons</b>" },
    2: { images: ["pictures/A1.jpeg", "pictures/A2.jpeg", "pictures/A3.jpeg"], name: "Room 1", info: "Adviser: <b>Placeholder</b><br>Room size: <b>7 x 9 Meters </b><br>Room estimated capacity: <b>45 persons</b>" },
    3: { images: ["pictures/can123.jpg", "pictures/can123.jpg", "pictures/can123.jpg"], name: "Canteen", info: "A canteen where students can buy food and drinks during break time. It provides a convenient place for students to purchase meals within the school campus. This room supports students' daily needs by making food accessible during school hours." },
    4: { images: ["pictures/office1.jpg", "pictures/office2.jpg", "pictures/office3.jpg"], name: "Room 3 ", info: "The administration office. It manages important school records, student documents, and official transactions. Students and parents may visit this office for concerns, requests, enrollment matters, and other school-related inquiries. It plays an important role in maintaining organization and proper communication within the school." },
    5: { images: ["pictures/LEARNING1.jpeg", "pictures/LEARNING2.jpeg", "pictures/LEARNING3.jpeg"], name: "Learning Center / Stairs", info: "Room 5 is a Learning Center where students can study, read, and conduct research. It supports academic improvement by providing a quiet and focused learning environment. The room includes stairs that serves as an emergency exit to ensure safety." },
    6: { images: ["pictures/A4.jpeg", "pictures/A5.jpeg", "pictures/A6.jpeg"], name: "Room 5", info: "Adviser: <b>Sir, Joseph Cruz</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    7: { images: ["pictures/A7.jpeg", "pictures/A8.jpeg", "pictures/A9.jpeg"], name: "Room 6", info: "Adviser: <b>Ma'am, Sheena Mae De Guzman </b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    8: { images: ["pictures/B4.jpeg", "pictures/B5.jpeg", "pictures/B6.jpeg"], name: "Room 7", info: "Adviser: <b>Ma'am, Luzviminda Panahon</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    9: { images: ["pictures/B1.jpeg", "pictures/B2.jpeg", "pictures/B3.jpeg"], name: "Room 8", info: "Adviser: <b>Ma'am, Carol Villa</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    10: { images: ["pictures/CAN4.jpeg", "pictures/CAN5.jpeg", "pictures/CAN6.jpeg"], name: "Canteen / Stairs", info: "A canteen for buying food and drinks. It contains stairs that can be used as an emergency exit if needed. This setup supports both student convenience and school safety preparedness." },
    11: { images: ["pictures/C4.jpeg", "pictures/C5.jpeg", "pictures/C6.jpeg"], name: "Room 13", info: "Adviser: <b> Ma'am, Jovita Dela Cruz</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    12: { images: ["pictures/C7.jpeg", "pictures/C8.jpeg", "pictures/C9.jpeg"], name: "Room 14", info: "Adviser: <b>Ma'am, Claudine Rupac</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    13: { images: ["pictures/E4.jpeg", "pictures/E5.jpeg", "pictures/E6.jpeg"], name: "Room 15", info: "Adviser: <b>Ma'am, Rafa</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    14: { images: ["pictures/F1.jpeg", "pictures/F2.jpeg", "pictures/F3.jpeg"], name: "Room 16", info: "Adviser: <b>ma'am, Naida, Kristina Manubay</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    15: { images: ["pictures/H4.jpeg", "pictures/H5.jpeg", "pictures/H6.jpeg"], name: "Room 19", info: "Adviser: <b>Ma'am, Anna Tuazon Martin</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    16: { images: ["pictures/E4.jpeg", "pictures/E5.jpeg", "pictures/E6.jpeg"], name: "Room 18", info: "Adviser: <b>Ma'am, Arlene Julian</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    17: { images: ["pictures/E7.jpeg", "pictures/E8.jpeg", "pictures/E9.jpeg"], name: "Room 17", info: "Adviser:<b>Sir, Ryan San Jose <br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    18: { images: ["pictures/H7.jpeg", "pictures/H8.jpeg", "pictures/H9.jpeg"], name: "Room 21", info: "Adviser: <b>Ma'am,Tita Zebate Castillo</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    19: { images: ["pictures/F7.jpeg", "pictures/F8.jpeg", "pictures/F9.jpeg"], name: "Room 20", info: "Adviser:<b>Ma'am,Angel Grace Lacanlalay</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    20: { images: ["pictures/G4.jpeg", "pictures/G5.jpeg", "pictures/G6.jpeg"], name: "Room 22", info: "Adviser:<b>Ma'am,Cherrie Tunod</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    21: { images: ["pictures/G1.jpeg", "pictures/G2.jpeg", "pictures/G3.jpeg"], name: "Room 21", info: "Adviser: <b>Sir,Saul Aquino</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    22: { images: ["pictures/egg1.jpeg", "pictures/egg2.jpeg", "pictures/egg3.jpeg"], name: "Teachers' Faculty", info: "Teachers' faculty room used for lesson preparation, organizing teaching materials, and discussing academic matters. It provides teachers with a dedicated space to perform their professional duties effectively." },
    23: { images: ["pictures/b9r1-1.jpeg", "pictures/b9r1-2.jpeg", "pictures/b9r1-3.jpeg"], name: "Room 28", info: "Adviser: <b>Placeholder</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    24: { images: ["pictures/b9r2-1.jpeg", "pictures/b9r2-2.jpeg", "pictures/b9r2-3.jpeg"], name: "Room 29", info: "Adviser: <b>Placeholder</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    25: { images: ["pictures/b9r3-1.jpeg", "pictures/b9r3-2.jpeg", "pictures/b9r3-3.jpeg"], name: "Room 30", info: "Adviser: <b>Placeholder</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    26: { images: ["pictures/A.jpeg", "pictures/A.jpeg", "pictures/A.jpeg"], name: "Stairs / Fire Exit", info: "Stairs and serves as a fire exit. It is an important safety feature that allows quick and orderly evacuation during emergencies. Proper use of this exit helps reduce risks during unexpected situations." },
    27: { images: ["pictures/b10r1-1.jpeg", "pictures/b10r1-2.jpeg", "pictures/b10r1-3.jpeg"], name: "Room 34", info: "Adviser: <b>Placeholder</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    28: { images: ["pictures/b10r2-1.jpeg", "pictures/b10r2-2.jpeg", "pictures/b10r2-3.jpeg"], name: "Room 35", info: "Adviser: <b>Placeholder</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    29: { images: ["pictures/CAN1.jpeg", "pictures/CAN2.jpeg", "pictures/CAN3.jpeg"], name: "Canteen / Stairs", info: "A canteen where students can buy food and drinks. It includes stairs that functions as an emergency exit. The presence of the stairs strengthens the school's safety measures by providing an alternative evacuation route during emergencies." },
    30: { images: ["pictures/H1.jpeg", "pictures/H2.jpeg", "pictures/H3.jpeg"], name: "Room 27", info: "Adviser: <b>Ma'am, Leonora Mendoza Garo-Dawang</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    31: { images: ["pictures/G7.jpeg", "pictures/G8.jpeg", "pictures/G9.jpeg"], name: "Room 26", info: "Adviser: <b>Sir, Jhune Gapac</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    32: { images: ["pictures/park1.jpeg", "pictures/park2.jpeg", "pictures/park3.jpeg"], name: "ENGLISH Park / Faucet Area", info: "This school park has a faucet where students and teachers can access clean water anytime. It is useful for washing hands and cleaning small messes, especially during break time or outdoor activities. It also helps keep plants fresh and healthy by providing water for daily maintenance. Having a faucet in the park promotes proper hygiene and keeps the surroundings clean and pleasant.<br><br>In case of emergency, the faucet can be used to quickly wash wounds, clean dirt from the eyes, or provide water if someone feels unwell due to heat. It can also serve as an immediate water source if a small fire occurs, helping to control the situation while waiting for further assistance. This makes the school park not only a relaxing place for students, but also a safer and more prepared environment." },
    33: { images: ["pictures/park4.jpeg", "pictures/park5.jpeg", "pictures/park6.jpeg"], name: "AP Park / Faucet Area", info: "This school park has a faucet where students and teachers can access clean water anytime. It is useful for washing hands and cleaning small messes, especially during break time or outdoor activities. It also helps keep plants fresh and healthy by providing water for daily maintenance. Having a faucet in the park promotes proper hygiene and keeps the surroundings clean and pleasant.<br><br>In case of emergency, the faucet can be used to quickly wash wounds, clean dirt from the eyes, or provide water if someone feels unwell due to heat. It can also serve as an immediate water source if a small fire occurs, helping to control the situation while waiting for further assistance. This makes the school park not only a relaxing place for students, but also a safer and more prepared environment." },
    34: { images: ["pictures/park7.jpeg", "pictures/park8.jpeg", "pictures/park9.jpeg"], name: "VE Park / Faucet Area", info: "This school park has a faucet where students and teachers can access clean water anytime. It is useful for washing hands and cleaning small messes, especially during break time or outdoor activities. It also helps keep plants fresh and healthy by providing water for daily maintenance. Having a faucet in the park promotes proper hygiene and keeps the surroundings clean and pleasant.<br><br>In case of emergency, the faucet can be used to quickly wash wounds, clean dirt from the eyes, or provide water if someone feels unwell due to heat. It can also serve as an immediate water source if a small fire occurs, helping to control the situation while waiting for further assistance. This makes the school park not only a relaxing place for students, but also a safer and more prepared environment." },
    35: { images: ["pictures/park10.jpeg", "pictures/park11.jpeg", "pictures/park12.jpeg"], name: "TLE Park / Faucet Area", info: "This school park has a faucet where students and teachers can access clean water anytime. It is useful for washing hands and cleaning small messes, especially during break time or outdoor activities. It also helps keep plants fresh and healthy by providing water for daily maintenance. Having a faucet in the park promotes proper hygiene and keeps the surroundings clean and pleasant.<br><br>In case of emergency, the faucet can be used to quickly wash wounds, clean dirt from the eyes, or provide water if someone feels unwell due to heat. It can also serve as an immediate water source if a small fire occurs, helping to control the situation while waiting for further assistance. This makes the school park not only a relaxing place for students, but also a safer and more prepared environment." },
    36: { images: ["pictures/PARK17.jpeg", "pictures/PARK18.jpeg", "pictures/PARK18.jpeg"], name: "SCIENCE Park / Faucet Area", info: "This school park has a faucet where students and teachers can access clean water anytime. It is useful for washing hands and cleaning small messes, especially during break time or outdoor activities. It also helps keep plants fresh and healthy by providing water for daily maintenance. Having a faucet in the park promotes proper hygiene and keeps the surroundings clean and pleasant.<br><br>In case of emergency, the faucet can be used to quickly wash wounds, clean dirt from the eyes, or provide water if someone feels unwell due to heat. It can also serve as an immediate water source if a small fire occurs, helping to control the situation while waiting for further assistance. This makes the school park not only a relaxing place for students, but also a safer and more prepared environment." },
    37: { images: ["pictures/A.jpeg", "pictures/A.jpeg", "pictures/A.jpeg"], name: "Math Park/ Faucet Area", info: "The Math Park and Faculty Area is an open learning space designed to support both student learning and teacher preparation. The park includes math-related tools and visual materials such as geometric shape displays, number charts, angle guides, measurement markers, and problem-solving stations that help students understand mathematical concepts through real-life examples and interactive activities. These features allow students to explore patterns, symmetry, computation, and critical thinking outside the traditional classroom setting. Within the same area, the faculty space provides teachers with a dedicated environment for lesson planning, organizing instructional materials, and supervising outdoor academic activities. This combined setup creates a productive space that encourages hands-on learning while supporting effective teaching and academic coordination. " },
    38: { images: ["pictures/A.jpeg", "pictures/A.jpeg", "pictures/A.jpeg"], name: "DRRM Center / Teachers' Faculty", info: "Functions as the Disaster Risk Reduction and Management (DRRM) Center and as a teachers' faculty room. It is the area where emergency plans are prepared and safety coordination is organized during disasters such as earthquakes or fires. At the same time, teachers use this room to prepare lessons, check student work, and meet." },
    39: { images: ["pictures/LEARNING4.jpeg", "pictures/LEARNING5.jpeg", "pictures/LEARNING4.jpeg"], name: "Learning Hub", info: "The Learning Hub is a shared educational space where students can study, read learning materials, and work on academic activities in a quiet and focused environment. It is usually equipped with books, reference materials, learning resources, and sometimes digital tools that help students research information and complete school work. The Learning Hub supports independent learning, group study sessions, and academic enrichment outside the classroom. It helps students improve their study habits, research skills, and understanding of different subjects through guided and self-paced learning activities." },
    40: { images: ["pictures/A.jpeg", "pictures/A.jpeg", "pictures/A.jpeg"], name: "Teachers' Faculty", info: "It serves as a workspace for teachers where they prepare instructional materials, plan lessons, and manage academic responsibilities. This room provides a professional environment for staff collaboration and preparation." },
    41: { images: ["pictures/A.jpeg", "pictures/A.jpeg", "pictures/A.jpeg"], name: "Room 41", info: "Adviser: <b>Placeholder</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" }
};

/* SECOND FLOOR ROOM DATA */
const secondFloorRoomData = {
    3: { images: ["pictures/A.jpeg", "pictures/A.jpeg", "pictures/A.jpeg"], name: "Room 4", info: "The Computer Laboratory is a specialized room equipped with computers and digital tools used to support students' learning in technology and other academic subjects." },
    4: { images: ["pictures/A.jpeg", "pictures/A.jpeg", "pictures/A.jpeg"], name: "Room 4", info: "The Computer Laboratory is a specialized room equipped with computers and digital tools." },
    5: { images: ["pictures/ROOM51.jpeg", "pictures/ROOM51.jpeg", "pictures/ROOM51.jpeg"], name: "Faculty and Stairs", info: "The Stairs and Faculty Area serves both as an access point and a professional workspace within the school." },
    6: { images: ["pictures/E1.jpeg", "pictures/E2.jpeg", "pictures/E3.jpeg"], name: "Room 9", info: "Adviser: <b>Ma'am, Athena Tuazon Germino</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    7: { images: ["pictures/D7.jpeg", "pictures/D8.jpeg", "pictures/D9.jpeg"], name: "Room 10", info: "Adviser: <b>Ma'am, Monique Mendoza</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    8: { images: ["pictures/D4.jpeg", "pictures/D5.jpeg", "pictures/D6.jpeg"], name: "Room 11", info: "Adviser: <b>Ma'am, Catherine Viernes</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    9: { images: ["pictures/D1.jpeg", "pictures/D2.jpeg", "pictures/D3.jpeg"], name: "Room 12", info: "Adviser: <b>Ma'am, Dianne Garcia Alog</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    10: { images: ["pictures/TAASNGCAN1.jpeg", "pictures/TAASNGCAN2.jpeg", "pictures/TAASNGCAN1.jpeg"], name: "Stairs", info: "The stairs serve as an important access point within the school." },
    20: { images: ["pictures/A.jpeg", "pictures/A.jpeg", "pictures/A.jpeg"], name: "Room 24", info: "The Computer Laboratory is a specialized room equipped with computers and digital tools." },
    21: { images: ["pictures/SCIENCELAB1.jpeg", "pictures/SCIENCELAB2.jpeg", "pictures/SCIENCELAB3.jpeg"], name: "Room 25", info: "The Science Laboratory is a specialized room where students conduct scientific experiments." },
    23: { images: ["pictures/COMPUTERLAB1.jpeg", "pictures/COMPUTERLAB2.jpeg", "pictures/COMPUTERLAB3.jpeg"], name: "Room 31", info: "The Computer Laboratory is a specialized room equipped with computers and digital tools." },
    24: { images: ["pictures/taasgitna3.jpeg", "pictures/taasgitna2.jpeg", "pictures/taasgitna1.jpeg"], name: "Room 32", info: "Adviser: <b>Placeholder</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    25: { images: ["pictures/COOK1.jpeg", "pictures/COOK2.jpeg", "pictures/COOK3.jpeg"], name: "Room 33", info: "Adviser: <b>Placeholder</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    26: { images: ["pictures/A.jpeg", "pictures/A.jpeg", "pictures/A.jpeg"], name: "Stairs / Faculty", info: "The Stairs and Faculty Area serves both as an access point and a professional workspace." },
    27: { images: ["pictures/A.jpeg", "pictures/A.jpeg", "pictures/A.jpeg"], name: "Room 36", info: "Adviser: <b>Sir, Bernard Gonzalez</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    28: { images: ["pictures/A.jpeg", "pictures/A.jpeg", "pictures/A.jpeg"], name: "Room 37", info: "Adviser: <b>Ma'am, Marivic Panahon</b><br>Room size: <b>7 x 9 Meters</b><br>Room estimated capacity: <b>45 persons</b>" },
    29: { images: ["pictures/TAASNGCAN3.jpeg", "pictures/TAASNGCAN4.jpeg", "pictures/TAASNGCAN3.jpeg"], name: "Stairs", info: "The stairs serve as an important access point within the school." }
};

/* BUILDING DATA */
const buildingData = {
    1: { images: ["pictures/BUILDING1.jpeg", "pictures/BUILDING2.jpeg", "pictures/BUILDING3.jpeg"], info: "Building 1: " },
    2: { images: ["pictures/BUILDING4.jpeg", "pictures/BUILDING5.jpeg", "pictures/BUILDING6.jpeg"], info: "Building 2: " },
    3: { images: ["pictures/BUILDING21.jpeg", "pictures/BUILDING22.jpeg", "pictures/BUILDING21.jpeg"], info: "Building 3: " },
    4: { images: ["pictures/A.jpeg", "pictures/A.jpeg", "pictures/A.jpeg"], info: "Building 4: " },
    5: { images: ["pictures/BUILDING19.jpeg", "pictures/BUILDING20.jpeg", "pictures/BUILDING19.jpeg"], info: "Building 5: " },
    6: { images: ["pictures/BUILDING13.jpeg", "pictures/BUILDING14.jpeg", "pictures/BUILDING15.jpeg"], info: "Building 6: " },
    7: { images: ["pictures/BUILDING18.jpeg", "pictures/BUILDING16.jpeg", "pictures/BUILDING17.jpeg"], info: "Building 7: " },
    8: { images: ["pictures/egg1.jpeg", "pictures/egg2.jpeg", "pictures/egg3.jpeg"], info: "Building 8: " },
    9: { images: ["pictures/BUILDING26.jpeg", "pictures/BUILDING27.jpeg", "pictures/BUILDING28.jpeg"], info: "Building 9: " },
    10: { images: ["pictures/BUILDING23.jpeg", "pictures/BUILDING24.jpeg", "pictures/BUILDING25.jpeg"], info: "Building 10: " },
    11: { images: ["pictures/BUILDING7.jpeg", "pictures/BUILDING8.jpeg", "pictures/BUILDING9.jpeg"], info: "Building 11: " }
};

let currentImages = [];
let index = 0;
let currentMode = "rooms";
let currentDisaster = "Flood";
let currentFloor = "all";
const secondFloorRooms = [3,4,5,6,7,8,9,10,20,21,23,24,25,26,27,28,29];

const dangerReasons = {
    // Damage Potential and Hazard Level Description
    1: "Low Potential Damage & Hazard Level This area has low potential damage and minimal hazards. The structure is strong and can handle minor shaking, strong winds, or small emergency impacts. The space is well-organized, with clear pathways and nearby exits for quick evacuation. Only a few objects could possibly fall or block movement. Overall, the area remains safe, but staying alert and following safety rules is still essential. ⚠️",
    2: "Moderate potential damage and hazards during disasters. Some furniture, equipment, or materials may fall, shift, or block pathways during emergencies such as earthquakes, fires, or strong storms. While the main structure of the building remains mostly safe, certain non-structural parts or items inside the area may be damaged and require repairs. Occasional crowding may also slow evacuation, so proper awareness and safety practices are important. ⚠️",
    3: "High potential damage and significant hazards during disasters. Heavy equipment, electrical devices, walls, or important installations may be damaged by strong shaking, fire, or strong winds. These materials can also cause injuries or start fires if not handled properly. Pathways may become blocked during emergencies, making evacuation difficult. Because of these hazards, the area may become unsafe for use until proper repairs are made. ⚠️",
    4: "Very high potential damage and extreme hazards during disasters. Severe events such as strong earthquakes, fires, or extreme weather may cause major structural damage or even collapse. The area may contain flammable materials, unstable structures, exposed electrical systems, or limited exits, making it highly dangerous during emergencies. Because of these hazards, immediate evacuation is necessary as staying in the area can be extremely unsafe. ⚠️ "
};

// Danger of Room Description
const dangerRoomReasons = {
    1: "<span style='font-size:18px;'><b>Legend 1 – Low Danger</b></span><br><br><span style='font-size:16px;'><b>Recommendation:</b> Students should avoid touching classroom equipment that they do not understand, such as wires, plugs, projectors, and other electrical devices. They should also avoid running inside the classroom because it can cause small accidents like slipping or bumping into desks and chairs. Being careful with these things helps keep the classroom safe.</span>",
    2: "<span style='font-size:18px;'><b>Legend 2 – Moderate Danger</b></span><br><br><span style='font-size:16px;'><b>Recommendation:</b> If students see exposed wires, broken chairs, wet floors, or scattered bags on the floor, they should not ignore them. They should keep a safe distance and inform the teacher so the problem can be fixed. These hazards may look small, but they can still cause injuries if not addressed.</span>",
    3: "<span style='font-size:18px;'><b>Legend 3 – High Danger</b></span><br><br><span style='font-size:16px;'><b>Recommendation:</b> Students should never play with fire, matches, or lighters inside the classroom because it can quickly cause a fire. They should also avoid climbing on chairs, tables, or windows since this can lead to serious accidents. If someone is doing these dangerous actions, it should be reported to the teacher immediately.</span>",
    4: "<span style='font-size:18px;'><b>Legend 4 – Very High Danger</b></span><br><br><span style='font-size:16px;'><b>Recommendation:</b> If there is already a serious hazard such as smoke, burning smell, fire, or a major electrical problem, students should stay calm and move away from the area right away. They should follow the teacher's instructions and leave the classroom in an orderly manner if needed. Quick and calm action can help prevent serious harm to everyone.</span>"
};

/* POPUP */
function openRoom(id) {
    // Stop weather update when popup opens to prevent glitching
    if (typeof stopWeatherUpdate === 'function') {
        stopWeatherUpdate();
    }
    
    let data;
    let dangerLevel = 0;
    
    if (currentFloor === "second" && secondFloorRooms.includes(parseInt(id))) {
        data = secondFloorRoomData[id];
        if (secondFloorModeColors[currentDisaster]) {
            dangerLevel = secondFloorModeColors[currentDisaster]['r' + id] || 0;
        }
    } else {
        data = roomData[id];
        if (modeColors[currentDisaster]) {
            dangerLevel = modeColors[currentDisaster]['r' + id] || 0;
        }
    }

    currentImages = data.images;
    index = 0;

    const dangerExplanation = dangerReasons[dangerLevel] || "No risk assessment available.";
    const dangerRoomExplanation = dangerRoomReasons[dangerLevel] || "";

    document.getElementById("carousel-img").src = currentImages[0];
    document.getElementById("info-title").innerText = data.name;
    document.getElementById("info-text").innerHTML = data.info + "<br><br><b>DAMAGE POTENTIAL AND RISK LEVEL:</b><br>" + dangerExplanation + "<br><br>" + dangerRoomExplanation;

    document.getElementById("popup").style.display = "flex";
}

/* IMAGE ONLY POPUP FOR ROUNDED ROOMS (r32-r37) */
function openImagePopup(id) {
    // Stop weather update when popup opens to prevent glitching
    if (typeof stopWeatherUpdate === 'function') {
        stopWeatherUpdate();
    }
    
    const data = roomData[id];
    currentImages = data.images;
    index = 0;

    document.getElementById("carousel-img").src = currentImages[0];
    document.getElementById("info-title").innerText = data.name;
    document.getElementById("info-text").innerHTML = data.info;

    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    // Resume weather update when popup is closed
    if (typeof startWeatherUpdate === 'function') {
        startWeatherUpdate();
    }
}

function prevImage() {
    index = (index - 1 + currentImages.length) % currentImages.length;
    document.getElementById("carousel-img").src = currentImages[index];
}

function nextImage() {
    index = (index + 1) % currentImages.length;
    document.getElementById("carousel-img").src = currentImages[index];
}

/* Rooms */
const modeColors = {
    Default: { r1: 0, r2: 0, r3: 0, r4: 0, r5: 0, r6: 0, r7: 0, r8: 0, r9: 0, r10: 0, r11: 0, r12: 0, r13: 0, r14: 0, r15: 0, r16: 0, r17: 0, r18: 0, r19: 0, r20: 0, r21: 0, r22: 0, r23: 0, r24: 0, r25: 0, r26: 0, r27: 0, r28: 0, r29: 0, r30: 0, r31: 0, r32: 0, r33: 0, r34: 0, r35: 0, r36: 0, r37: 0, r38: 0, r39: 0, r40: 0, r41: 0 },
    Flood: { r1: 2, r2: 2, r3: 2, r4: 2, r5: 2, r6: 2, r7: 2, r8: 2, r9: 2, r10: 2, r11: 2, r12: 2, r13: 2, r14: 2, r15: 3, r16: 3, r17: 3, r18: 4, r19: 4, r20: 3, r21: 3, r22: 2, r23: 2, r24: 2, r25: 2, r26: 2, r27: 2, r28: 2, r29: 2, r30: 1, r31: 1, r32: 1, r33: 1, r34: 1, r35: 1, r36: 1, r37: 1, r38: 1, r39: 3, r40: 3, r41: 1 },
    Fire: { r1: 4, r2: 3, r3: 3, r4: 2, r5: 4, r6: 3, r7: 2, r8: 2, r9: 2, r10: 3, r11: 2, r12: 2, r13: 1, r14: 2, r15: 2, r16: 2, r17: 2, r18: 2, r19: 2, r20: 2, r21: 1, r22: 3, r23: 3, r24: 2, r25: 1, r26: 2, r27: 2, r28: 2, r29: 1, r30: 1, r31: 1, r32: 1, r33: 1, r34: 1, r35: 1, r36: 1, r37: 1, r38: 1, r39: 4, r40: 3, r41: 1 },
    Quake: { r1: 3, r2: 2, r3: 2, r4: 2, r5: 3, r6: 2, r7: 2, r8: 2, r9: 2, r10: 3, r11: 3, r12: 3, r13: 2, r14: 3, r15: 3, r16: 1, r17: 2, r18: 2, r19: 3, r20: 3, r21: 2, r22: 2, r23: 3, r24: 1, r25: 2, r26: 2, r27: 2, r28: 1, r29: 2, r30: 1, r31: 1, r32: 1, r33: 1, r34: 1, r35: 1, r36: 1, r37: 1, r38: 1, r39: 2, r40: 2, r41: 1 },
    Storm: { r1: 2, r2: 2, r3: 2, r4: 2, r5: 2, r6: 3, r7: 2, r8: 1, r9: 3, r10: 2, r11: 3, r12: 2, r13: 2, r14: 3, r15: 3, r16: 2, r17: 3, r18: 2, r19: 1, r20: 2, r21: 2, r22: 2, r23: 1, r24: 1, r25: 1, r26: 1, r27: 1, r28: 2, r29: 3, r30: 2, r31: 1, r32: 1, r33: 1, r34: 1, r35: 1, r36: 1, r37: 1, r38: 1, r39: 3, r40: 3, r41: 1 },
};

const secondFloorModeColors = {
    Default: { r3: 5, r4: 5, r5: 5, r6: 5, r7: 5, r8: 5, r9: 5, r10: 5, r20: 5, r21: 5, r23: 5, r24: 5, r25: 5, r26: 5, r27: 5, r28: 5, r29: 5 },
    Flood: { r3: 1, r4: 1, r5: 1, r6: 1, r7: 1, r8: 1, r9: 1, r10: 1, r20: 1, r21: 1, r23: 1, r24: 1, r25: 1, r26: 1, r27: 1, r28: 1, r29: 1 },
    Fire: { r3: 4, r4: 3, r5: 1, r6: 2, r7: 2, r8: 2, r9: 2, r10: 1, r20: 4, r21: 2, r23: 3, r24: 3, r25: 4, r26: 3, r27: 2, r28: 3, r29: 2 },
    Quake: { r3: 4, r4: 3, r5: 3, r6: 2, r7: 3, r8: 3, r9: 2, r10: 2, r20: 3, r21: 3, r23: 4, r24: 2, r25: 3, r26: 2, r27: 3, r28: 2, r29: 3 },
    Storm: { r3: 2, r4: 3, r5: 2, r6: 2, r7: 2, r8: 2, r9: 2, r10: 2, r20: 3, r21: 2, r23: 2, r24: 1, r25: 2, r26: 3, r27: 2, r28: 1, r29: 2 },
};

/* SAFE ZONE COLORS - Each disaster has its own safe zone configuration */
const safeZoneColors = {
    // Safe zones for FLOOD - areas that are safe during floods (higher ground, upper floors)
    Flood: { r1: 5, r2: 5, r3: 1, r4: 1, r5: 5, r6: 1, r7: 1, r8: 1, r9: 1, r10: 5, r11: 5, r12: 5, r13: 5, r14: 5, r15: 5, r16: 5, r17: 5, r18: 5, r19: 5, r20: 1, r21: 1, r22: 5, r23: 1, r24: 1, r25: 1, r26: 1, r27: 1, r28: 1, r29: 1, r30: 1, r31: 1, r32: 5, r33: 5, r34: 5, r35: 5, r36: 5, r37: 5, r38: 5, r39: 5, r40: 5, r41: 5 },
    // Safe zones for FIRE - areas that are safe during fires (away from fire sources, open areas)
    Fire: { r1: 5, r2: 5, r3: 5, r4: 5, r5: 5, r6: 5, r7: 5, r8: 5, r9: 5, r10: 5, r11: 5, r12: 5, r13: 5, r14: 5, r15: 5, r16: 5, r17: 5, r18: 5, r19: 5, r20: 5, r21: 5, r22: 5, r23: 5, r24: 5, r25: 5, r26: 5, r27: 5, r28: 5, r29: 5, r30: 5, r31: 5, r32: 1, r33: 1, r34: 1, r35: 1, r36: 1, r37: 5, r38: 5, r39: 5, r40: 5, r41: 1 },
    // Safe zones for QUAKE - areas that are safe during earthquakes (open areas, away from buildings)
    Quake: { r1: 5, r2: 5, r3: 5, r4: 5, r5: 5, r6: 5, r7: 5, r8: 5, r9: 5, r10: 5, r11: 5, r12: 5, r13: 5, r14: 5, r15: 5, r16: 5, r17: 5, r18: 5, r19: 5, r20: 5, r21: 5, r22: 5, r23: 5, r24: 5, r25: 5, r26: 5, r27: 5, r28: 5, r29: 5, r30: 5, r31: 5, r32: 5, r33: 5, r34: 5, r35: 5, r36: 5, r37: 5, r38: 5, r39: 5, r40: 5, r41: 1 },
    // Safe zones for STORM - areas that are safe during storms (indoor, away from windows)
    Storm: { r1: 5, r2: 5, r3: 5, r4: 5, r5: 5, r6: 5, r7: 5, r8: 5, r9: 5, r10: 5, r11: 5, r12: 5, r13: 5, r14: 5, r15: 5, r16: 5, r17: 5, r18: 5, r19: 5, r20: 5, r21: 5, r22: 5, r23: 1, r24: 1, r25: 1, r26: 1, r27: 1, r28: 1, r29: 1, r30: 5, r31: 5, r32: 5, r33: 5, r34: 5, r35: 5, r36: 5, r37: 5, r38: 5, r39: 5, r40: 5, r41: 5 },
    
};


function clearRoomColors() {
    document.querySelectorAll(".room").forEach(room => {
        room.classList.remove("room-0", "room-1", "room-2", "room-3", "room-4");
    });
}

/* Apply safe zone colors based on selected disaster */
function applySafeZone(disasterType) {
    clearRoomColors();
    
    // Update active state of circle buttons
    document.querySelectorAll(".circle").forEach(circle => {
        circle.classList.remove("active");
    });
    document.querySelectorAll(".circle").forEach(circle => {
        if (circle.innerText.trim() === disasterType) {
            circle.classList.add("active");
        }
    });
    
    const safeSet = safeZoneColors[disasterType];
    if (!safeSet) return;
    
    Object.keys(safeSet).forEach(id => {
        const room = document.getElementById(id);
        if (room) {
            room.classList.add("room-" + safeSet[id]);
        }
    });
}

function applyMode(mode) {
    currentDisaster = mode;

    document.querySelectorAll(".circle").forEach(circle => {
        circle.classList.remove("active");
    });

    document.querySelectorAll(".circle").forEach(circle => {
        if (circle.innerText.trim() === mode) {
            circle.classList.add("active");
        }
    });

    clearRoomColors();

    let set;
    if (currentFloor === "second") {
        set = secondFloorModeColors[mode];
    } else {
        set = modeColors[mode];
    }
    Object.keys(set).forEach(id => {
        const room = document.getElementById(id);
        if (room) {
            room.classList.add("room-" + set[id]);
        }
    });

    if (currentMode === "buildings") {
        colorBuildings();
    }

    if (currentDisaster === "Default") {
        document.querySelector('.big-rectangle').style.background = '';
        document.querySelectorAll(".room").forEach(room => room.style.display = "flex");
    } else if (currentMode === "rooms") {
        document.querySelector('.big-rectangle').style.background = '';
        document.querySelectorAll(".room").forEach(room => room.style.display = "flex");
    }
}

const buildingMap = {
    1: [1, 2],
    2: [3, 4],
    3: [5, 6, 7, 8, 9, 10],
    4: [11, 12, 13, 14],
    5: [15, 16, 17],
    6: [18, 19],
    7: [20, 21],
    8: [22],
    9: [23, 24, 25, 26],
    10: [27, 28, 29],
    11: [30, 31]
};

const buildingColors = {
    Default: { d1: 0, d2: 0, d3: 0, d4: 0, d5: 0, d6: 0, d7: 0, d8: 0, d9: 0, d10: 0, d11: 0 },
    Flood: { d1: 1, d2: 1, d3: 2, d4: 2, d5: 3, d6: 3, d7: 3, d8: 3, d9: 3, d10: 3, d11: 3 },
    Fire: { d1: 4, d2: 4, d3: 2, d4: 1, d5: 1, d6: 3, d7: 2, d8: 4, d9: 4, d10: 1, d11: 4 },
    Quake: { d1: 4, d2: 4, d3: 3, d4: 1, d5: 2, d6: 4, d7: 2, d8: 2, d9: 4, d10: 1, d11: 3 },
    Storm: { d1: 1, d2: 4, d3: 4, d4: 1, d5: 2, d6: 3, d7: 2, d8: 1, d9: 3, d10: 2, d11: 1 },


};

function switchMode(mode) {
    currentMode = mode;

    document.getElementById("room-btn").classList.remove("active");
    document.getElementById("building-btn").classList.remove("active");
    document.getElementById("floor-btn").classList.remove("active");
    document.getElementById("safe-zone-btn").classList.remove("active");

    if (mode === "rooms") {
        document.getElementById("room-btn").classList.add("active");
    } else if (mode === "buildings") {
        document.getElementById("building-btn").classList.add("active");
    } else if (mode === "floor") {
        document.getElementById("floor-btn").classList.add("active");
    } else if (mode === "safe-zone") {
        document.getElementById("safe-zone-btn").classList.add("active");
    }

    if (mode === "safe-zone") {
        currentFloor = "all";
        document.querySelectorAll(".building").forEach(b => b.remove());
        const bgDiv = document.getElementById('background-div');
        if (bgDiv) bgDiv.remove();
        document.querySelector('.big-rectangle').style.background = '';
        document.querySelectorAll(".room").forEach(r => {
            r.style.display = "flex";
            r.style.width = '';
            r.style.height = '';
            r.style.pointerEvents = "auto";
        });
        document.querySelectorAll(".room").forEach(r => r.classList.remove("room-blurred"));
        clearRoomColors();
        // Apply safe zone colors based on current disaster
        if (safeZoneColors[currentDisaster]) {
            applySafeZone(currentDisaster);
        } else {
            applyMode("Flood");
        }
    } else if (mode === "buildings") {
        currentFloor = "all";
        let bgDiv = document.getElementById('background-div');
        if (!bgDiv) {
            bgDiv = document.createElement('div');
            bgDiv.id = 'background-div';
            bgDiv.style.position = 'absolute';
            bgDiv.style.top = '0';
            bgDiv.style.left = '0';
            bgDiv.style.width = '100%';
            bgDiv.style.height = '100%';
            bgDiv.style.background = getComputedStyle(document.querySelector('.big-rectangle')).background;
            bgDiv.style.zIndex = '1';
            bgDiv.style.filter = 'blur(2px)';
            document.querySelector('.big-rectangle').appendChild(bgDiv);
        }
        document.querySelector('.big-rectangle').style.background = 'none';
        createBuildings(() => {
            applyMode(currentDisaster);
            document.querySelectorAll(".room").forEach(r => r.style.display = "none");
        });
        document.querySelectorAll(".room").forEach(r => r.style.pointerEvents = "none");
    } else {
        currentFloor = "all";
        const bgDiv = document.getElementById('background-div');
        if (bgDiv) bgDiv.remove();
        document.querySelector('.big-rectangle').style.background = '';
        document.querySelectorAll(".building").forEach(b => b.remove());
        document.querySelectorAll(".room").forEach(r => {
            r.style.display = "flex";
            r.style.width = '';
            r.style.height = '';
            r.style.pointerEvents = "auto";
        });
        document.querySelectorAll(".room").forEach(r => r.classList.remove("room-blurred"));
        applyMode(currentDisaster);
    }
}

function createBuildings(callback) {
    document.querySelectorAll(".building").forEach(b => b.remove());

    const mapEl = document.querySelector(".big-rectangle");

    const hiddenRooms = [];
    document.querySelectorAll(".room").forEach(r => {
        if (r.style.display === "none") {
            r.style.display = "flex";
            hiddenRooms.push(r);
        }
    });

    setTimeout(() => {
        Object.keys(buildingMap).forEach(bIndex => {
            const rooms = buildingMap[bIndex];
            const hasVisibleRoom = rooms.some(r => {
                const el = document.getElementById("r" + r);
                return el && el.style.display !== "none";
            });
            if (!hasVisibleRoom) return;

            let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;

            rooms.forEach(r => {
                const el = document.getElementById("r" + r);
                if (el && el.style.display !== "none") {
                    const rect = el.getBoundingClientRect();
                    const mapRect = mapEl.getBoundingClientRect();
                    const L = rect.left - mapRect.left;
                    const T = rect.top - mapRect.top;
                    const R = L + rect.width;
                    const B = T + rect.height;
                    left = Math.min(left, L);
                    top = Math.min(top, T);
                    right = Math.max(right, R);
                    bottom = Math.max(bottom, B);
                }
            });

            const div = document.createElement("div");
            div.className = "building";
            div.id = "building-" + bIndex;
            div.style.left = left + "px";
            div.style.top = top + "px";
            div.style.width = (right - left) + "px";
            div.style.height = (bottom - top) + "px";
            div.onclick = () => openBuilding(bIndex);

            const lbl = document.createElement("div");
            lbl.className = "label";
            lbl.innerText = "B" + bIndex;
            div.appendChild(lbl);

            mapEl.appendChild(div);
        });

        hiddenRooms.forEach(r => r.style.display = "none");
        if (callback) callback();
    });
}

function colorBuildings() {
    document.querySelectorAll(".building").forEach((b) => {
        const id = parseInt(b.id.split("-")[1]);
        let color = 0;
        if (buildingColors[currentDisaster] && buildingColors[currentDisaster]['d' + id] !== undefined) {
            color = buildingColors[currentDisaster]['d' + id];
        } else {
            const rooms = buildingMap[id];
            rooms.forEach(r => {
                const roomEl = document.getElementById("r" + r);
                if (roomEl) {
                    const classes = roomEl.classList;
                    for (let cls of classes) {
                        if (cls.startsWith("room-")) {
                            const level = parseInt(cls.split("-")[1]);
                            if (level > color) color = level;
                        }
                    }
                }
            });
        }
        b.classList.remove("building-0", "building-1", "building-2", "building-3", "building-4");
        b.classList.add("building-" + color);
    });
}

function openBuilding(bid) {
    currentImages = buildingData[bid].images;
    index = 0;
    document.getElementById("carousel-img").src = currentImages[0];
    document.getElementById("info-title").innerText = "Building " + bid;
    document.getElementById("info-text").innerText = buildingData[bid].info;
    document.getElementById("popup").style.display = "flex";
}

function switchFloor() {
    document.getElementById("room-btn").classList.remove("active");
    document.getElementById("building-btn").classList.remove("active");
    document.getElementById("floor-btn").classList.remove("active");
    document.getElementById("safe-zone-btn").classList.remove("active");

    if (currentFloor === "all") {
        currentFloor = "second";
        currentMode = "floor";
        document.getElementById("floor-btn").classList.add("active");
        document.querySelectorAll(".building").forEach(b => b.remove());
        const bgDiv = document.getElementById('background-div');
        if (bgDiv) bgDiv.remove();
        document.querySelector('.big-rectangle').style.background = '';
        document.querySelectorAll(".room").forEach(r => r.classList.remove("room-blurred"));
        document.querySelectorAll(".room").forEach(room => {
            room.style.display = "flex";
            room.style.pointerEvents = "auto";
        });
        applyMode(currentDisaster);
    } else {
        currentFloor = "all";
        currentMode = "rooms";
        document.getElementById("floor-btn").classList.remove("active");
        document.getElementById("room-btn").classList.add("active");
        document.querySelectorAll(".room").forEach(room => {
            room.style.display = "flex";
            room.style.pointerEvents = "auto";
        });
        applyMode(currentDisaster);
    }
}

/* ZOOM FUNCTIONS */
let currentZoom = 1;
const ZOOM_STEP = 0.1;
const MAX_ZOOM = 3;
const MIN_ZOOM = 0.5;

function zoomIn() {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;
    
    if (currentZoom < MAX_ZOOM) {
        currentZoom += ZOOM_STEP;
        // Scale the entire map container to keep all positions relative
        mapContainer.style.transform = 'scale(' + currentZoom + ')';
        mapContainer.style.transformOrigin = 'center center';
    }
}

function zoomOut() {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;
    
    if (currentZoom > MIN_ZOOM) {
        currentZoom -= ZOOM_STEP;
        // Scale the entire map container to keep all positions relative
        mapContainer.style.transform = 'scale(' + currentZoom + ')';
        mapContainer.style.transformOrigin = 'center center';
    }
}

