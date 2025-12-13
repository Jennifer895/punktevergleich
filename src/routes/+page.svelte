<script>
    // 'data' enthält die Ergebnisse der load-Funktion: aktuellerStand und historie
    export let data;
    const { aktuellerStand, historie } = data;
</script>

<div class="container">
    <h1>🏆 Punktevergleich</h1>

    <section class="current-stand">
        <h2>Aktueller Stand</h2>
        <div class="score-card">
            <div class="score-item felix-score">
                <h3>Felix</h3>
                <p>{aktuellerStand.scoreA}</p>
            </div>
            <div class="score-item jenny-score">
                <h3>Jenny</h3>
                <p>{aktuellerStand.scoreB}</p>
            </div>
        </div>
    </section>

    <section class="history">
        <h2>Punkte-Historie</h2>
        
        {#if historie && historie.length > 0}
            <table>
                <thead>
                    <tr>
                        <th>Woche</th>
                        <th>Felix Punkte</th>
                        <th>Jenny Punkte</th>
                        <th>Wochen-Ausgleich</th>
                        <th>Gesamt-Differenz</th>
                    </tr>
                </thead>
                <tbody>
                    {#each historie as eintrag}
                        <tr>
                            <td>{eintrag.woche}</td>
                            <td>{eintrag.felix_punkte}</td>
                            <td>{eintrag.jenny_punkte}</td>
                            <td>{eintrag.wochen_ausgleich}</td>
                            <td>{eintrag.gesamt_differenz}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {:else}
            <p>Es ist noch keine Historie vorhanden.</p>
        {/if}
    </section>
</div>

<style>
    .container { max-width: 800px; margin: 0 auto; padding: 20px; font-family: sans-serif; }
    h1 { text-align: center; color: #333; }
    .score-card { display: flex; justify-content: space-around; gap: 20px; margin-bottom: 40px; }
    .score-item { padding: 20px; border: 2px solid #ccc; border-radius: 8px; text-align: center; flex-grow: 1; }
    .score-item h3 { margin-top: 0; font-size: 1.5em; }
    .score-item p { font-size: 3em; font-weight: bold; color: #007bff; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
</style>