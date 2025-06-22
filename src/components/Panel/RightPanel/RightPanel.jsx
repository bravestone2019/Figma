import "./RightPanel.css";
import Angle from "../../../assets/angle.png";
import Appearance from "../../../assets/clock.png";
import Corner from "../../../assets/corner.png";

const RightPanel = ({ collapsed, scale, position = { x: 100, y: 100 } }) => {
     const zoomPercent = Math.round((scale || 1) * 100);

    return (
        <div className={`right-panel ${collapsed ? "collapsed" : ""}`}>
            {!collapsed && (
                <div className="right-panel-content">
                    <div className="right-panel-header">
                        <div className="right-section-header">Design</div>
                        <div className="zoom-indicator">
                            {zoomPercent}%
                        </div>
                    </div>
                    <div className="right-header-divider" />

                    <div className="right-panel-scrollable">
                    {/* Position */}
                    <div className="right-section-title">Position</div>
                    <div className="position-grid">
                        <div className="pos-box">
                            <span>X</span>
                            <input
                                type="number"
                                defaultValue={Math.round(position.y)}
                                // className="pos-box input"
                            />
                        </div>
                        <div className="pos-box">
                            <span>Y</span>
                            <input
                                type="number"
                                defaultValue={Math.round(position.y)}
                                // className="pos-box input"
                            />
                        </div>
                        <div className="pos-box">
                            <img src={Angle} alt="Angle" style={{ width: 12, height: 10 }} />
                            <input
                                type="number"
                                defaultValue={Math.round(position.y)}
                                // className="pos-box input"
                            />
                        </div>
                        <div className="pos-box" style={{ display: "flex", gap: "10px" }}>
                            <button style={{ background: "none", border: "none", padding: 0, borderRight: "2px solid #fff" }}>
                                <img src={Angle} alt="Angle" style={{ width: 12, height: 10, marginRight: 6}} />
                            </button>
                            <button style={{ background: "none", border: "none", padding: 0, borderRight: "2px solid #fff" }}>
                                <img src={Angle} alt="Angle" style={{ width: 12, height: 10, marginRight: 6}} />
                            </button>
                            <button style={{ background: "none", border: "none", padding: 0 }}>
                                <img src={Angle} alt="Angle" style={{ width: 12, height: 10,  marginRight: 2 }} />
                            </button>
                        </div>
                    </div>

                    {/* Thin grey line divider */}
                        <div className="section-divider"/>
                        
                        <div className="right-section-title">Layout</div>
                        <div className="position-grid">
                            <div className="pos-box">
                                <span>W</span>
                                <input
                                    type="number"
                                    defaultValue={Math.round(position.y)}
                                    // className="pos-box input"
                                />
                                </div>
                                <div className="pos-box">
                                <span>H</span>
                                <input
                                    type="number"
                                    defaultValue={Math.round(position.y)}
                                    // className="pos-box input"
                                />
                                </div>
                        </div>

                        {/* Thin grey line divider */}
                        <div className="section-divider"/>

                        <div className="right-section-title">Appearance</div>
                        <div className="position-grid">
                            <div className="pos-box">
                                <img src={Appearance} alt="Appearance" style={{ width: 12, height: 10 }} />
                                <input
                                    type="number"
                                    defaultValue={Math.round(position.y)}
                                    // className="pos-box-input"
                                />
                            </div>
                            <div className="pos-box">
                                <img src={Corner} alt="Corner" style={{ width: 12, height: 10 }} />
                                <input
                                    type="number"
                                    defaultValue={Math.round(position.y)}
                                    // className="pos-box-input"
                                />
                            </div>
                        </div>

                        {/* Thin grey line divider */}
                        <div className="section-divider"/>

                        <div className="right-section-title">Fill</div>
                        <div className="position-grid">
                            <div className="pos-box-fill">
                                <span>X</span>
                                {/* <span>{Math.round(position.x)}</span> */} 
                            </div>
                        </div>

                        {/* Thin grey line divider */}
                        <div className="section-divider"/>

                        <div className="right-section-title">Stroke</div>
                        <div className="position-grid">
                            <div className="pos-box">
                                <span>X</span>
                                <span>{Math.round(position.x)}</span>
                                </div>
                                <div className="pos-box">
                                <span>Y</span>
                                <span>{Math.round(position.y)}</span>
                                </div>
                        </div>

                        {/* Thin grey line divider */}
                        <div className="section-divider"/>

                        <div className="right-section-title">Effects</div>
                        <div className="position-grid">
                            <div className="pos-box">
                                <span>X</span>
                                <span>{Math.round(position.x)}</span>
                                </div>
                                <div className="pos-box">
                                <span>Y</span>
                                <span>{Math.round(position.y)}</span>
                                </div>
                        </div>
                </div>
                </div>
            )}
        </div>
    );
};

export default RightPanel;