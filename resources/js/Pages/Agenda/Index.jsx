import MainLayout from "../../Layouts/MainLayout.jsx";
import AgendaNavbar from "./Partials/AgendaNavbar.jsx";
import AgendaList from "./Partials/AgendaList.jsx";
import EditLogo from "../../../assets/images/EditLogo.png";
import PlusIcon from "../../../assets/images/PlusIcon.png";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import AgendaCreate from "./Partials/AgendaCreate.jsx";
import TagList from "./Partials/TagList.jsx";

export default function Index({ agendas, tags, filters }) {
    const [activeAgendaPage, setActiveAgendaPage] = useState("listAgendaState");
    const [editAgendaData, setEditAgendaData] = useState(null);

    const handleEditAgendaData = (agendaBubbleData) => {
        setEditAgendaData(agendaBubbleData);
        setActiveAgendaPage("editAgendaState");
    };

    const handleSearchButton = ({filters}) => {
        router.get(
            route("agenda.index"), {
                include: filters.include, 
                exclude: filters.exclude,
                search: filters.search
            }, {
                preserveState:true,
                preserveScroll: true,
                replace:true
            }
        );
    };

    return (
        <>
            <div className="flex flex-col grow rounded gap-2">
                {activeAgendaPage === "listAgendaState" && (
                    <div>
                        <AgendaNavbar onSearch={handleSearchButton} tagList = {tags}/>
                        <div className="relative">
                            <AgendaList
                                agendas={agendas}
                                onEditClick={handleEditAgendaData}
                            />
                            <div className="pointer-events-none sticky bottom-6 flex justify-end items-center gap-4 pr-6 w-full z-50">
                                <button
                                    onClick={() =>
                                        setActiveAgendaPage("createAgendaState")
                                    }
                                    title="Add Agenda"
                                    className="pointer-events-auto h-14 w-14 flex items-center justify-center rounded-full
                                        bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl
                                        hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
                                >
                                    <img
                                        src={PlusIcon}
                                        alt="Add Agenda"
                                        className="h-8 w-8 object-contain drop-shadow-md"
                                    />
                                </button>
                                {/* TOMBOL EDIT */}
                                <button
                                    onClick={() =>
                                        setActiveAgendaPage("listTagState")
                                    }
                                    title="List Tags"
                                    className="pointer-events-auto h-17 w-17 flex items-center justify-center rounded-full
                                    hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
                                >
                                    <img
                                        src={EditLogo}
                                        alt="Edit Tags"
                                        // Paksa gambar agar ukurannya nge-pas dengan tombol h-14 w-14
                                        className="h-full w-full object-contain drop-shadow-xl hover:brightness-90 transition-all"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeAgendaPage === "createAgendaState" && (
                    <AgendaCreate
                        availableTags={tags}
                        onCancel={() => setActiveAgendaPage("listAgendaState")}
                    />
                )}

                {activeAgendaPage === "editAgendaState" && (
                    <AgendaCreate
                        availableTags={tags}
                        onCancel={() => {
                            setActiveAgendaPage("listAgendaState");
                            setEditAgendaData(null);
                        }}
                        agendaData={editAgendaData}
                    />
                )}

                {activeAgendaPage === "listTagState" && (
                    <TagList
                        searchFilters = {filters}
                        availableTags={tags}
                        onCancel={() => setActiveAgendaPage("listAgendaState")}
                    />
                )}
            </div>
        </>
    );
}

Index.layout = (page) => <MainLayout children={page} />;