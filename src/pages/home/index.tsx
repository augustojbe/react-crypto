import { Link, useNavigate } from "react-router-dom";
import style from "./home.module.css";
import { BsSearch } from "react-icons/bs";
import { useState, FormEvent, useEffect } from "react";

// https://api.coincap.io/v2/assets?limit=10&offset=0

export interface CoinProps {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer: string;
  formatedPrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
}
interface DataProps {
  data: CoinProps[];
}

export function Home() {
  const [input, setInput] = useState("");
  const [coins, setCoins] = useState<CoinProps[]>([]);
  const [offset, setOffeSet] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [offset]);

  async function getData() {
    fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`)
      .then((response) => response.json())
      .then((data: DataProps) => {
        const coinsData = data.data;

        const price = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });
        const priceCompact = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
        });

        const formatedResult = coinsData.map((item) => {
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.priceUsd)),
            formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
            formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
          };
          return formated;
        });

        const listCooins = [...coins, ...formatedResult];
        setCoins(listCooins);
      });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log(input);
    if (input === "") return;

    navigate(`/detail/${input}`);
  }
  function handleGetMore() {
    if (offset === 0) {
      setOffeSet(10);
      return;
    }
    setOffeSet(offset + 10);
  }

  return (
    <main className={style.container}>
      <form className={style.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o nome da moeda"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <BsSearch size={30} color="#FFF" />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor de Mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
            <th scope="col">Mudança 24h</th>
          </tr>
        </thead>
        <tbody id="tbody">
          {/* fazendo condicional para retornar itens */}
          {coins.length > 0 &&
            coins.map((item) => (
              <tr className={style.tr} key={item.id}>
                <td className={style.tdLabel} data-label="Moeda">
                  <div className={style.name}>
                    <Link to={`/detail/${item.id}`}>
                      <img
                        className={style.logo}
                        src={`https://assets.coincap.io/assets/icons/${item.symbol.toLocaleLowerCase()}@2x.png`}
                        alt="Logo Cripto"
                      />
                      <span>{item.name}</span> | {item.symbol}
                    </Link>
                  </div>
                </td>
                <td className={style.tdLabel} data-label="Valor de Mercado">
                  {item.formatedMarket}
                </td>
                <td className={style.tdLabel} data-label="Preço">
                  {item.formatedPrice}
                </td>
                <td className={style.tdLabel} data-label="Volume">
                  {item.formatedVolume}
                </td>
                <td
                  className={
                    Number(item.changePercent24Hr) > 0
                      ? style.tdProfit
                      : style.tdLoss
                  }
                  data-label="Mudança 24h"
                >
                  <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <button className={style.buttonMore} onClick={handleGetMore}>
        Carregar mais...
      </button>
    </main>
  );
}
