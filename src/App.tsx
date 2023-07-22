import { useEffect, useState } from 'react';
import { TextField } from "@mui/material";
import './App.css'
import { generateWeekFromOffset, findSchicht, formatDateForSchichten, calculatePlannedTime, generateDatesBetween } from './functions/datefunctions.ts';
import users from "./data/users.json";
import defaultSchichten from "./data/schichten.json";

interface schicht {
  title: string,
  start: string,
  ende: string,
  user: string
  date: string
}

interface template {
  title: string,
  start: string,
  ende: string,
}

function App() {
  //ausgewählte Woche 0 bedeutet keine aktuelle Woche, -1 letzte Woche +1 nächste Woche, etc.
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("null");
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date());
  const [selectedEndeDate, setSelectedEndeDate] = useState<Date>(new Date());
  const [selectedTemplate, setSelectedTemplate] = useState<template>({title: "", start: "", ende: ""});
  const [schichten, setSchichten] = useState<schicht[]>([]);

  const days: string[] = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const templates: template[] = [
    {"title": "Frühschicht", "start": "06:00", "ende": "15:00" },
    {"title": "Spätschicht", "start": "15:00", "ende": "21:00"}
  ]

  const displayWeek = generateWeekFromOffset(selectedWeek);

  const handleOpenDialog = (myDate: Date, myUser: string) => {
    setDialogOpen(true);
    setSelectedStartDate(myDate);
    setSelectedEndeDate(myDate);
    setSelectedUser(myUser);
  };

  useEffect(() => {
    setSchichten(defaultSchichten);
  }, []);

  const addSchicht = () => {
    if (selectedTemplate.title === "") {
      return alert("Bitte Schichtmodell auswählen");
    }
    const inputStart = new Date(selectedStartDate.setHours(0, 0, 0, 0));
    const inputEnde = new Date(selectedEndeDate.setHours(0, 0, 0, 0));
    const dateArray = generateDatesBetween(inputStart, inputEnde)
      .map(obj => {
        return {
          ...selectedTemplate,
          user: selectedUser,
          date: formatDateForSchichten(obj),
        }
      });
    console.log(dateArray)
    const newSchichten = [...schichten, ...dateArray];
    setSchichten(newSchichten);
    setSelectedTemplate({title: "", start: "", ende: ""});
    setDialogOpen(false);
  };

  calculatePlannedTime(displayWeek, schichten, "Tim");

  return (
    <>
      <button className="week-button" onClick={() => setSelectedWeek(selectedWeek - 1)}>letzte Woche</button>
      <button className="week-button" onClick={() => setSelectedWeek(0)}>diese Woche</button>
      <button className="week-button" onClick={() => setSelectedWeek(selectedWeek + 1)}>nächste Woche</button>
      <table>
        <thead>
          <tr>
            <th className="table-head" >User</th>
            {displayWeek.map((day) => (
              <th className="table-head" key={day.getDay()}>{days[day.getDay()]}<br />{day.toLocaleDateString("de-DE")}</th>
            ))}
            <th className="table-head">Geplant/Soll</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td className="name-panel">{user}</td>
              {displayWeek.map((day) => (
                <td key={day.getDay()}>
                  <div>
                    {findSchicht(schichten, user, day.toDateString()).slice(0, 2).map((schicht, index) => (
                      <div key={index} className="schicht-panel">
                        {schicht.title}<br />{schicht.start}-{schicht.ende}
                      </div>
                    ))}
                    {findSchicht(schichten, user, day.toDateString()).length < 2 ? <button onClick={() => handleOpenDialog(day, user)} className="add-button">+</button> : null}
                  </div>
                </td>
              ))}
              <td>{calculatePlannedTime(displayWeek, schichten, user)}/40</td>
            </tr>
          ))}
        </tbody>
      </table>
      <dialog open={dialogOpen}>
        <p>{selectedUser}</p>
        <TextField type="date" value={selectedStartDate.toISOString().split('T')[0]} onChange={(event) => setSelectedStartDate(new Date(event.target.value))} />
        <TextField type="date" value={selectedEndeDate.toISOString().split('T')[0]} onChange={(event) => setSelectedEndeDate(new Date(event.target.value))} />
        <div>
          {templates.map((template) => (
            <div key={template.title} onClick={() => setSelectedTemplate(template)} style={{ backgroundColor: selectedTemplate.title === template.title ? "yellow" : "" }}>{template.title}</div>
          ))}
        </div>
        <button onClick={addSchicht}>Schicht anlegen</button>
        <button onClick={() => setDialogOpen(false)}>Schließen</button>
      </dialog>
    </>
  )
}

export default App
