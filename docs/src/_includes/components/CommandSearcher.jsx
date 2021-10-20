import React, { useEffect, useState, useRef } from 'react'
import dataset from '/static/commands.json'

function CommandSearcher() {
  const [commands, setCommands] = useState([])
  const [filteredCommands, setFilteredCommands] = useState([])

  let input = useRef()

  useEffect(async () => {
    input.current.value = 'help'
    const expandedDataset = []
    dataset.forEach((data) => {
      expandedDataset.push({
        title: ('node ' + data[0]).toLowerCase(),
        type: 'nodejs',
        command: data[1],
        html: format(data[1]),
      })

      const executableCommand = data[1].replace('cth', 'to/cithak')
      expandedDataset.push({
        title: ('executable ' + data[0]).toLowerCase(),
        type: 'executable',
        command: executableCommand,
        html: format(executableCommand),
      })
    })

    console.log(expandedDataset)
    setCommands(expandedDataset)
  }, [])

  useEffect(() => {
    updateCommandsFilter()
  }, [commands])

  function updateCommandsFilter() {
    if (!(input && input.current)) return

    const filter = input.current.value.toLowerCase()
    const newCommands = commands.filter(
      ({ title }) => filter === '' || title.indexOf(filter) > -1
    )

    setFilteredCommands(newCommands)
  }

  function copyClipboard(el, str) {
    navigator.clipboard.writeText(str)
    el.classList.add('clicked')
    setTimeout(() => el.classList.remove('clicked'), 1500)
  }

  return (
    <div className="command-search">
      <input
        type="text"
        className="input"
        placeholder="Search Example Commands..."
        onChange={updateCommandsFilter}
        ref={input}
      />

      <div className="container">
        {filteredCommands.map((commandData, i) => {
          const { type, command, html } = commandData

          return (
            <div
              className="command-box"
              key={i}
              onClick={(e) => copyClipboard(e.target, command)}
            >
              <div>
                <p className="type">{type}</p>
                <p
                  className="command"
                  dangerouslySetInnerHTML={{ __html: html }}
                ></p>
              </div>
              <i className="bi bi-clipboard copy" title="copy"></i>
              <i className="bi bi-check-lg check" title="copied"></i>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function format(str) {
  return str
    .replace(/((?:cth)|(?:to\/cithak))/, '<span class="primary">$1</span>')
    .replace(/(\[[^ \[\]]+\])/g, '<span class="highlight">$1</span>')
}

export default CommandSearcher
