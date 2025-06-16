import { useEffect, useState, useContext, useRef } from "react";
import logo from "../../../public/International_Pokemon_logo.svg.png";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useAllPokemons from "../../hooks/useAllPokemons";
import { UserContext } from "../../context/UserContext";
import AccomplishedTrade from "./AccomplishedTrade";

export default function TradeHistory() {
  const [trades, setTrades] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const searchRef = useRef();
  const [sortKey, setSortKey] = useState("updated_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterRole, setFilterRole] = useState("all");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    searchRef.current.focus();
  }, []);

  useEffect(() => {
    const fetchTrade = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://127.0.0.1:8000/api/trade/history", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          return;
        }

        const result = await res.json();

        setTrades(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrade();
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredTrades = trades.filter((trade) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      trade.sender_pokemon.name.toLowerCase().includes(query) ||
      trade.receiver_pokemon.name.toLowerCase().includes(query) ||
      trade.sender.name.toLowerCase().includes(query) ||
      trade.receiver.name.toLowerCase().includes(query) ||
      trade.updated_at.toLowerCase().includes(query);

    const isInitiator = trade.sender.id === currentUser.id;
    const isReceiver = trade.receiver.id === currentUser.id;

    const matchesRole =
      filterRole === "all" ||
      (filterRole === "initiator" && isInitiator) ||
      (filterRole === "receiver" && isReceiver);

    return matchesSearch && matchesRole;
  });

  const sortedTrades = [...filteredTrades].sort((a, b) => {
    if (sortKey === "updated_at") {
      const dateA = new Date(a.updated_at);
      const dateB = new Date(b.updated_at);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="verify-email-container">
        <div className="verify-email-card">
          <div className="loading-message">
            <h2>Loading Trade History...</h2>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <Link to="/">
          <img src={logo} alt="Pokemon Logo" className="logo" />
        </Link>
        <h1>Pokémon Trade History</h1>
        <div className="create-buttons-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name, race, owner, or time..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
              ref={searchRef}
            />
            <div className="sort-buttons">
              <button
                className={`sort-button ${
                  sortKey === "updated_at" ? "active" : ""
                }`}
                onClick={() => handleSort("updated_at")}
              >
                Time{" "}
                {sortKey === "updated_at"
                  ? sortOrder === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </button>
              <button
                className={`own-button ${
                  filterRole === "initiator" ? "active" : ""
                }`}
                onClick={() => setFilterRole("initiator")}
              >
                Initiator
              </button>
              <button
                className={`own-button ${
                  filterRole === "receiver" ? "active" : ""
                }`}
                onClick={() => setFilterRole("receiver")}
              >
                Receiver
              </button>
              <button
                className={`own-button ${filterRole === "all" ? "active" : ""}`}
                onClick={() => setFilterRole("all")}
              >
                All
              </button>
            </div>
          </div>
        </div>
        {sortedTrades.length === 0 ? (
          <div className="no-results">
            <h2>No Trade Found</h2>
            <p>
              Try searching by:
              <ul>
                <li>Pokémon name</li>
                <li>Race</li>
                <li>User</li>
              </ul>
              Check if there are any typos or try different search terms.
            </p>
          </div>
        ) : (
          <div className="trade-history-list">
            {sortedTrades.map((trade) => (
              <AccomplishedTrade key={trade.id} trade={trade} />
            ))}
          </div>
        )}
      </header>
    </div>
  );
}
